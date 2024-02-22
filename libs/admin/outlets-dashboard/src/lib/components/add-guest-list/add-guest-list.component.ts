import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { slotHours } from '../../constants/guest-list.const';
import {
  AdminUtilityService,
  BookingDetailService,
  ConfigService,
  Option,
  QueryConfig,
  manageMaskZIndex,
} from '@hospitality-bot/admin/shared';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { AddGuestForm } from '../../types/form';
import { OutletFormService } from '../../services/outlet-form.service';
import { OutletTableService } from '../../services/outlet-table.service';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { AddGuestComponent } from 'libs/admin/guests/src/lib/components';
import { concatMap, debounceTime, switchMap, tap } from 'rxjs/operators';
import { AreaListResponse, AreaResponse } from '../../types/outlet.response';
import { GuestFormData } from '../../models/guest-reservation.model';
import { TableList } from 'libs/table-management/src/lib/models/data-table.model';

type GuestReservationForm = {
  tables: string[];
  personCount: number;
  guest: string;
  marketSegment: string;
  checkIn: number;
  checkOut: number;
  remark: string;
  outletType: string;
  slotHours: number;
  areaId: string[];
  seated: boolean;
};

type TableOption = Option & { disabled: boolean; areaId: string };

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
    this.entityId = this.globalFilterService.entityId;
    this.initOptions();
    this.initForm();
  }

  initOptions(): void {
    this.getMarketSegments();
  }

  initForm() {
    this.useForm = this.fb.group({
      tables: [[], Validators.required],
      personCount: [null, Validators.min(1)],
      guest: ['', Validators.required],
      marketSegment: ['', Validators.required],
      checkIn: [, Validators.required],
      checkOut: ['', Validators.required],
      slotHours: ['', Validators.required],
      remark: [''],
      outletType: ['RESTAURANT'],
      areaId: ['', Validators.required],
      seated: [true],
    });
    this.listenForTimeChanges();
    this.listenForTableChanges();

    if (this.guestReservationId) {
      this.getReservationDetails();
    } else {
      this.getTableList().subscribe(() => {
        this.useForm.patchValue({
          checkIn: new Date().getTime(),
          slotHours: 1800000,
        });
      });
    }
  }

  listenForTableChanges() {
    const { areaId, tables } = this.guestReservationFormControl;
    tables.valueChanges.subscribe((data) => {
      const id = this.backupData.find((table) => table.value === data[0])
        ?.areaId;
      areaId.patchValue(id);
    });
  }

  listenForTimeChanges(): void {
    const { checkIn, slotHours, seated } = this.guestReservationFormControl;
    checkIn.valueChanges.pipe(debounceTime(300)).subscribe((res) => {
      this.updateCheckOutTime();
      //update seating condition
      if (res > new Date().getTime()) {
        seated.patchValue(false);
      } else {
        seated.patchValue(true);
      }
    });
    slotHours.valueChanges.pipe(debounceTime(300)).subscribe((res) => {
      this.updateCheckOutTime();
    });
  }

  updateCheckOutTime() {
    const { checkIn, slotHours, checkOut } = this.guestReservationFormControl;

    const checkInTime = checkIn.value;
    const bookingTimeDuration = slotHours.value;

    if (checkIn && slotHours) {
      const checkOutTimeEpoch = checkInTime + bookingTimeDuration;
      checkOut.patchValue(checkOutTimeEpoch);

      this.getTableList(true).subscribe();
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
        .subscribe((reservation) => {
          const data = new GuestFormData().deserialize(reservation);
          this.useForm.patchValue(data);
        })
    );
  }

  getTableList(
    isCurrentBooking: boolean = false
  ): Observable<AreaListResponse> {
    const config: QueryConfig = {
      params: this.adminUtilityService.makeQueryParams([
        {
          type: 'AREA',
          sort: 'updated',
          raw: 'true',
          paginationFalse: true,
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
          const bookedTableIds: string[] = isCurrentBooking
            ? [...this.guestReservationFormControl.tables.value]
            : [];

          res.areas.forEach((item: AreaResponse) => {
            item.tables.forEach((table) => {
              if (isCurrentBooking) {
                bookedTableIds.push(table.id);
              } else {
                tableList.push({
                  label: table.number,
                  value: table.id,
                  areaId: item.id,
                  disabled: !bookedTableIds.includes(table.id),
                });
              }
            });
          });

          if (isCurrentBooking) {
            this.tableOptions = this.backupData.map((data) => {
              return {
                ...data,
                disabled: !bookedTableIds.includes(data.value),
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
      this.useForm.getRawValue() as AddGuestForm
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

  triggerStatusChange(event) {
    this.guestReservationFormControl.seated.patchValue(event);
  }

  /**
   * @function handleError to show the error
   * @param param0 network error
   */
  handleError = ({ error }): void => {
    this.loading = false;
  };

  handleFinal = () => {
    this.loading = false;
    this.close();
  };

  close() {
    this.onClose.emit(true);
  }

  get guestReservationFormControl() {
    return this.useForm.controls as Record<
      keyof GuestReservationForm,
      AbstractControl
    >;
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.$subscriptions.unsubscribe();
  }
}
