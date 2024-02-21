import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { slotHours, tableList } from '../../constants/guest-list.const';
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
import { Subscription, combineLatest } from 'rxjs';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { AddGuestComponent } from 'libs/admin/guests/src/lib/components';
import { debounceTime } from 'rxjs/operators';
import { AreaListResponse, AreaResponse } from '../../types/outlet.response';

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
};

@Component({
  selector: 'hospitality-bot-add-guest-list',
  templateUrl: './add-guest-list.component.html',
  styleUrls: ['./add-guest-list.component.scss'],
})
export class AddGuestListComponent implements OnInit {
  private $subscriptions = new Subscription();
  tableOptions: Option[] = [];
  marketSegments: Option[] = [];
  readonly slotOptions: Option[] = slotHours;
  startMinDate: Date = new Date();

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
    this.initForm();
    this.initOptions();
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
      checkIn: [new Date().getTime(), Validators.required],
      checkOut: ['', Validators.required],
      slotHours: ['30', Validators.required],
      remark: [''],
      outletType: ['RESTAURANT'],
    });

    this.listenForTimeChanges();
    this.updateCheckOutTime();
  }

  listenForTimeChanges(): void {
    const { checkIn, slotHours } = this.guestReservationFormControl;
    checkIn.valueChanges.pipe(debounceTime(300)).subscribe((res) => {
      this.updateCheckOutTime();
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
      // Convert slotHours from minutes to milliseconds
      const bookingTimeDurationInMill = bookingTimeDuration * 60 * 1000;

      // Calculate check-out time by adding slot hours to check-in time
      const checkOutTimeEpoch = checkInTime + bookingTimeDurationInMill;

      checkOut.patchValue(checkOutTimeEpoch);

      this.getTableList();
    }
  }

  getTableList(): void {
    const config: QueryConfig = {
      params: this.adminUtilityService.makeQueryParams([
        {
          type: 'AREA',
          offset: '0',
          limit: '50',
          sort: 'updated',
          raw: 'true',
          fromDate: this.guestReservationFormControl.checkIn.value,
          toDate: this.guestReservationFormControl.checkOut.value,
          createBooking: true,
        },
      ]),
    };

    this.$subscriptions.add(
      this.outletService
        .getList<AreaListResponse>(this.entityId, config)
        .subscribe((res) => {
          res.areas.forEach((item: AreaResponse) => {
            item.tables.forEach((table) => {
              this.tableOptions.push({
                label: table.number,
                value: table.id,
              });
            });
          });
        })
    );
  }

  openDetailsPage() {
    // TODO: Replace guestId
    this.bookingDetailService.openBookingDetailSidebar({
      guestId: '42ca7269-deef-4709-83fd-df34abb0cf7e',
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

    this.outletService.createReservation(formData).subscribe(
      (res) => {
        this.snackbarService.openSnackBarAsText('Guest Registered !', '', {
          panelClass: 'success',
        });
      },
      this.handleError,
      this.handleFinal
    );
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
}
