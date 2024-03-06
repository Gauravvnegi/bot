import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  BookingDetailService,
  ConfigService,
  Option,
  QueryConfig,
  manageMaskZIndex,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { AddGuestComponent } from 'libs/admin/guests/src/lib/components';
import { Observable, Subscription } from 'rxjs';
import {
  concatMap,
  debounceTime,
  distinctUntilChanged,
  skip,
  tap,
} from 'rxjs/operators';
import { slotHours } from '../../constants/guest-list.const';
import { GuestFormData } from '../../models/guest-reservation.model';
import { OutletFormService } from '../../services/outlet-form.service';
import { OutletTableService } from '../../services/outlet-table.service';
import { AreaListResponse, AreaResponse } from '../../types/outlet.response';

export type GuestReservationForm = {
  tables: string;
  personCount: number;
  guest: string;
  marketSegment: string;
  checkIn: number;
  checkOut: number;
  remark: string;
  outletType: string;
  slotHours: number;
  areaId: string;
  currentJourney: string;
  reservationType: string;
  source: string;
  sourceName: string;
};

type TableOption = Option & { disabled: boolean; areaId: string };

const ReservationType = {
  CONFIRMED: 'CONFIRMED',
  DRAFT: 'DRAFT',
} as const;

export type ReservationType = typeof ReservationType[keyof typeof ReservationType];

const ReservationStatus = {
  SEATED: 'SEATED',
  WAIT_LISTED: 'WAITLISTED',
} as const;

type ReservationStatus = typeof ReservationStatus[keyof typeof ReservationStatus];

@Component({
  selector: 'hospitality-bot-add-guest-list',
  templateUrl: './add-guest-list.component.html',
  styleUrls: ['./add-guest-list.component.scss'],
})
export class AddGuestListComponent implements OnInit {
  private $subscriptions = new Subscription();
  tableOptions: TableOption[] = [];
  backupData: TableOption[] = [];
  marketSegments: Option[] = [];
  bookingTypeOptions: Option<ReservationType>[] = [
    {
      label: 'Confirmed',
      value: ReservationType.CONFIRMED,
    },
    {
      label: 'Draft',
      value: ReservationType.DRAFT,
    },
  ];

  reservationStatusOptions: Option<ReservationStatus>[] = [
    {
      label: 'Seated',
      value: ReservationStatus.SEATED,
    },
    {
      label: 'Waitlisted',
      value: ReservationStatus.WAIT_LISTED,
    },
  ];

  areaOptions: Option[] = [];

  readonly slotOptions: { label: string; value: number }[] = slotHours;
  startMinDate: Date = new Date();
  guestReservationId: string;

  entityId: string;
  selectedGuest: Option;
  globalQueries = [];
  sidebarVisible: boolean = false;

  @ViewChild('sidebarSlide', { read: ViewContainerRef })
  sidebarSlide: ViewContainerRef;

  @Output()
  onClose = new EventEmitter<boolean>();

  useForm!: FormGroup;
  loading = false;

  currentTime: number = new Date().getTime();

  constructor(
    private fb: FormBuilder,
    private bookingDetailService: BookingDetailService,
    private adminUtilityService: AdminUtilityService,
    private snackbarService: SnackBarService,
    private formService: OutletFormService,
    private outletService: OutletTableService,
    private globalFilterService: GlobalFilterService,
    private resolver: ComponentFactoryResolver,
    private configService: ConfigService
  ) {}

  ngOnInit(): void {
    // this.entityId = this.globalFilterService.entityId;
    this.initOptions();
    this.initForm();
  }

  initOptions(): void {
    this.getMarketSegments();
  }

  initForm() {
    this.useForm = this.fb.group({
      reservationType: [ReservationType.CONFIRMED, Validators.required],
      tables: ['', Validators.required], //@multipleTableBooking
      personCount: [1, [Validators.required, Validators.min(1)]],
      guest: ['', Validators.required],
      marketSegment: ['', Validators.required],
      checkIn: [, Validators.required],
      checkOut: ['', Validators.required],
      slotHours: ['', Validators.required],
      remark: [''],
      outletType: ['RESTAURANT'],
      areaId: ['', Validators.required],
      currentJourney: ['', Validators.required],
      sourceName: [],
      source: [],
    });
    this.listenFormValueChanges();

    if (this.guestReservationId) {
      this.getReservationDetails();
    } else {
      this.getTableList().subscribe(() => {
        this.useForm.patchValue({
          checkIn: this.currentTime,
          slotHours: 1800000,
          currentJourney: ReservationStatus.SEATED,
        });
      });
    }
  }

  listenFormValueChanges(): void {
    const {
      checkIn,
      slotHours,
      currentJourney,
      reservationType,
      tables,
      areaId,
    } = this.guestReservationFormControl;

    tables.valueChanges.subscribe((data) => {
      /**
       * @multipleTableBooking: need to change logic, when we enable multi table bookings,
       */
      const id = this.backupData.find((table) => table.value === data)?.areaId;
      areaId.patchValue(id);
    });

    // Subscription for checkIn value changes
    checkIn.valueChanges
      .pipe(debounceTime(300), skip(1), distinctUntilChanged())
      .subscribe((res) => {
        this.updateCheckOutTime();

        //update seating condition
        if (!this.guestReservationId) {
          reservationType.value === ReservationType.CONFIRMED &&
            currentJourney.patchValue(
              !(res > this.currentTime)
                ? ReservationStatus.SEATED
                : ReservationStatus.WAIT_LISTED
            );
        }
      });

    // Subscription for slotHours value changes
    slotHours.valueChanges.pipe(debounceTime(300)).subscribe((res) => {
      this.updateCheckOutTime();
    });

    // Subscription for reservationType value changes
    reservationType.valueChanges.subscribe((response) => {
      if (response === ReservationType.DRAFT) {
        tables.clearValidators();
        currentJourney.patchValue(ReservationStatus.WAIT_LISTED);
      } else {
        tables.setValidators([Validators.required]);
      }
    });
  }

  updateCheckOutTime() {
    const { checkIn, slotHours, checkOut } = this.guestReservationFormControl;

    const checkInTime = checkIn.value;
    const bookingTimeDuration = slotHours.value;

    if (checkIn && slotHours) {
      const checkOutTimeEpoch = checkInTime + bookingTimeDuration;
      checkOut.patchValue(checkOutTimeEpoch);

      this.getTableList(true).subscribe(
        () => {},
        this.handleError,
        this.handelTableListFinal
      );
    }
  }

  getReservationDetails() {
    this.$subscriptions.add(
      this.getTableList()
        .pipe(
          concatMap(() =>
            this.outletService.getGuestReservationById(this.guestReservationId)
          )
        )
        .subscribe(
          (reservation) => {
            const data = new GuestFormData().deserialize(reservation);
            this.useForm.patchValue(data);
            this.updateFormValidations();
          },
          this.handleError,
          this.handelTableListFinal
        )
    );
  }

  updateFormValidations() {
    const {
      checkIn,
      guest,
      currentJourney,
      reservationType,
    } = this.guestReservationFormControl;

    if (currentJourney.value === ReservationStatus.SEATED) {
      this.startMinDate = new Date(checkIn.value); //min date validation
      currentJourney.disable();
      checkIn.disable();
      guest.disable();
      reservationType.disable();
    }
  }

  getTableList(
    isCurrentBooking: boolean = false
  ): Observable<AreaListResponse> {
    this.loading = true;
    const config: QueryConfig = {
      params: this.adminUtilityService.makeQueryParams([
        {
          type: 'AREA',
          sort: 'updated',
          raw: 'true',
          pagination: false,
          ...(isCurrentBooking && {
            createBooking: true,
            fromDate: this.guestReservationFormControl.checkIn.value,
            toDate: this.guestReservationFormControl.checkOut.value,
          }),
        },
      ]),
    };

    return this.outletService
      .getList<AreaListResponse>(this.entityId, config)
      .pipe(
        tap((res) => {
          const tableList: TableOption[] = [];
          const tableAvailableForBooking: string[] = isCurrentBooking
            ? [this.guestReservationFormControl.tables.value] //@multipleTableBooking: need to change for multiple tables bookings
            : [];

          res.areas.forEach((item: AreaResponse) => {
            if (!item.status) {
              //skip the inactive area response
              return;
            }

            //creating area options
            if (!this.areaOptions.find((area) => area.value === item.id))
              this.areaOptions.push({
                label: item.name,
                value: item.id,
              });

            //creating table options
            item.tables.forEach((table) => {
              if (isCurrentBooking) {
                tableAvailableForBooking.push(table.id);
              } else {
                tableList.push({
                  label: table.number,
                  value: table.id,
                  areaId: item.id,
                  disabled: false, //initially marking all table as available
                });
              }
            });
          });

          if (isCurrentBooking) {
            this.tableOptions = this.backupData.map((data) => {
              return {
                ...data,
                disabled: !tableAvailableForBooking.includes(data.value), //mark tables as unavailable which not includes in available table group
              };
            });
          } else {
            this.backupData = [...tableList];
            this.tableOptions = [...tableList];
          }
        })
      );
  }

  openDetailsPage() {
    this.bookingDetailService.openBookingDetailSidebar({
      guestId: this.guestReservationFormControl.guest.value,
      tabKey: 'guest_details',
    });
  }

  createReservation() {
    if (this.useForm.invalid) {
      this.useForm.markAllAsTouched();
      this.snackbarService.openSnackBarAsText('Invalid Form !');
      return;
    }

    const formData = this.formService.getGuestFormData(
      this.useForm.getRawValue()
    );

    if (this.guestReservationId) {
      this.outletService
        .updateGuestReservation(this.guestReservationId, formData)
        .subscribe(this.handelSuccess, this.handleError, this.handleFinal);
    } else {
      this.outletService
        .createReservation(formData)
        .subscribe(this.handelSuccess, this.handleError, this.handleFinal);
    }
  }

  getConfig(type = 'get') {
    if (type === 'search') return { type: 'GUEST' };
    const queries = {
      entityId: this.entityId,
      entityState: 'ALL',
      type: 'GUEST,NON_RESIDENT_GUEST',
    };
    return queries;
  }

  guestChange(event) {
    this.selectedGuest = {
      label: `${event.firstName} ${event.lastName}`,
      value: event.id,
    };
  }

  onAddGuest() {
    this.sidebarVisible = true;
    const factory = this.resolver.resolveComponentFactory(AddGuestComponent);
    this.sidebarSlide.clear();
    const componentRef = this.sidebarSlide.createComponent(factory);
    componentRef.instance.isSidebar = true;
    componentRef.instance.guestType = 'NON_RESIDENT_GUEST';
    this.$subscriptions.add(
      componentRef.instance.onCloseSidebar.subscribe((res) => {
        if (typeof res !== 'boolean') {
          this.selectedGuest = {
            label: `${res.firstName} ${res.lastName}`,
            value: res.id,
          };
        }
        this.sidebarVisible = false;
      })
    );
    manageMaskZIndex();
  }

  getMarketSegments(): void {
    this.$subscriptions.add(
      this.configService.$config.subscribe((response) => {
        this.marketSegments =
          response.bookingConfig.marketSegment.map((item) => ({
            label: item,
            value: item,
          })) ?? [];
      })
    );
  }

  handelSuccess = () => {
    this.snackbarService?.openSnackBarAsText(
      `Reservation is ${
        !this.guestReservationId ? 'created' : 'updated'
      } successfully`,
      '',
      { panelClass: 'success' }
    );
  };

  /**
   * @function handleError to show the error
   * @param param0 network error
   */
  handleError = ({ error }): void => {
    this.loading = false;
  };

  handleFinal = () => {
    this.loading = false;
    this.close(true);
  };

  handelTableListFinal = () => {
    this.loading = false;
  };

  close(config: boolean = false): void {
    this.onClose.emit(config);
  }

  get guestReservationFormControl() {
    return this.useForm.controls as Record<
      keyof GuestReservationForm,
      AbstractControl
    >;
  }

  get isDraftReservation(): boolean {
    return this.guestReservationFormControl.reservationType.value === 'DRAFT';
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.$subscriptions.unsubscribe();
  }
}
