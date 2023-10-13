import {
  Compiler,
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  Input,
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
import {
  GlobalFilterService,
  RoutesConfigService,
} from '@hospitality-bot/admin/core/theme';
import {
  ConfigService,
  EntitySubType,
  ModuleNames,
  Option,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import {
  BookingConfig,
  ReservationFormData,
} from 'libs/admin/manage-reservation/src/lib/models/reservations.model';
import { ManageReservationService } from 'libs/admin/manage-reservation/src/lib/services/manage-reservation.service';
import {
  GuestDetails,
  QuickReservationForm,
} from '../../../../../dashboard/src/lib/data-models/reservation.model';
import { FormService } from 'libs/admin/manage-reservation/src/lib/services/form.service';
import { Router } from '@angular/router';
import { IGRoomType } from '../reservation-calendar-view/reservation-calendar-view.component';
import { IGCol } from 'libs/admin/shared/src/lib/components/interactive-grid/interactive-grid.component';
import { Subscription } from 'rxjs';
import { AddGuestComponent } from 'libs/admin/guests/src/lib/components/add-guest/add-guest.component';
import { RoomTypeResponse } from 'libs/admin/room/src/lib/types/service-response';
import { RoomTypeForm } from 'libs/admin/room/src/lib/models/room.model';
import { GuestType } from 'libs/admin/guests/src/lib/types/guest.type';
@Component({
  selector: 'hospitality-bot-quick-reservation-form',
  templateUrl: './quick-reservation-form.component.html',
  styleUrls: ['./quick-reservation-form.component.scss'],
})
export class QuickReservationFormComponent implements OnInit {
  pageTitle = 'Add Item';
  navRoutes = [{ label: 'Add Item', link: './' }];

  useForm: FormGroup;

  startMinDate = new Date();
  endMinDate = new Date();

  entityId: string;
  reservationId: string;

  ratePlans: Option[] = [];
  roomOptions: Option[] = [];
  otaOptions: Option[] = [];

  globalQueries = [];

  loading: boolean = false;
  isBooking = false;
  editMode = false;

  selectedGuest: Option;
  defaultRoomType: IGRoomType;

  selectedRoom: string;
  date: IGCol;

  guestDetails: GuestDetails;
  configData: BookingConfig;
  reservationData: ReservationFormData;

  $subscription = new Subscription();

  isSidebar = false;
  sidebarVisible: boolean = false;
  @ViewChild('sidebarSlide', { read: ViewContainerRef })
  sidebarSlide: ViewContainerRef;

  errorMessage: string;

  @Output() onCloseSidebar = new EventEmitter<boolean>(false);
  @Input() set reservationConfig(value: QuickReservationConfig) {
    for (const key in value) {
      const val = value[key];
      this[key] = val;
    }

    if (this.defaultRoomType) this.initDetails();
  }

  constructor(
    private fb: FormBuilder,
    private snackbarService: SnackBarService,
    private globalFilterService: GlobalFilterService,
    private configService: ConfigService,
    private router: Router,
    private manageReservationService: ManageReservationService,
    private formService: FormService,
    private compiler: Compiler,
    private resolver: ComponentFactoryResolver,
    private routesConfigService: RoutesConfigService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.listenForGlobalFilters();
    this.getCountryCode();
    this.initDefaultDate();
    this.listenForSourceChanges();
  }

  initDetails() {
    if (this.reservationId) {
      this.initReservationDetails();
    } else {
      this.inputControls.roomInformation.patchValue({
        roomTypeId: this.defaultRoomType.value,
        roomNumber: this.selectedRoom,
      });
      this.setRoomInfo(this.defaultRoomType);
    }
  }

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
        this.globalQueries = [...data['dateRange'].queryValue];
        this.entityId = this.globalFilterService.entityId;
      })
    );
  }

  initDefaultDate() {
    const fromDate = this.date ? new Date(this.date) : new Date(); // Convert epoch to milliseconds
    const toDate = new Date(fromDate);
    this.startMinDate = new Date();
    this.endMinDate.setDate(new Date().getDate() + 1);
    toDate.setDate(fromDate.getDate() + 1); // Add 1 day
    this.inputControls.reservationInformation.patchValue({
      from: fromDate.getTime(),
      to: toDate.getTime(),
    });
  }

  initForm() {
    this.useForm = this.fb.group({
      reservationInformation: this.fb.group({
        from: ['', Validators.required],
        to: ['', Validators.required],
        source: ['', Validators.required],
        sourceName: ['', [Validators.required, Validators.maxLength(60)]],
        marketSegment: ['', Validators.required],
      }),

      roomInformation: this.fb.group({
        roomTypeId: ['', [Validators.required]],
        ratePlan: [{ value: '', disabled: true }],
        roomNumber: [{ value: '', disabled: true }],
        adultCount: ['', [Validators.required, Validators.min(1)]],
        childCount: ['', [Validators.min(0)]],
        id: [''],
      }),

      instructions: this.fb.group({
        specialInstructions: [''],
      }),

      guestInformation: this.fb.group({
        guestDetails: ['', [Validators.required]],
      }),

      dailyPrice: [''],
    });

    this.entityId = this.globalFilterService.entityId;
  }

  close(): void {
    this.onCloseSidebar.emit(false);
  }

  editForm() {
    this.routesConfigService.navigate({
      subModuleName: ModuleNames.ADD_RESERVATION,
      additionalPath: this.reservationId
        ? `edit-reservation/${this.reservationId}`
        : `add-reservation`,
      queryParams: {
        entityId: this.entityId,
      },
      openInNewWindow: true,
    });
  }

  initReservationDetails() {
    this.loading = true;
    this.$subscription.add(
      this.manageReservationService
        .getReservationDataById(this.reservationId, this.entityId)
        .subscribe(
          (res) => {
            const formData = new ReservationFormData().deserialize(res);
            this.reservationData = formData;
            this.roomControls.roomNumber.enable();
            this.calculateDailyPrice();
            const { roomInformation, ...data } = formData;
            this.guestDetails = {
              guestName:
                res.guest.firstName +
                ' ' +
                (res.guest?.lastName ? res.guest.lastName : ''),
              phoneNumber:
                res.guest.contactDetails?.cc +
                '' +
                res.guest?.contactDetails?.contactNumber,
              id: res.guest?.id ?? '',
              email: res.guest?.contactDetails?.emailId,
            };
            this.inputControls.guestInformation
              .get('guestDetails')
              .patchValue(res.guest.id);

            this.roomOptions = this.defaultRoomType.rooms.map((room) => ({
              label: room.roomNumber.toString(),
              value: room.roomNumber.toString(),
            }));

            this.useForm.patchValue(data);

            this.inputControls.roomInformation.patchValue(roomInformation[0]);
          },
          (error) => {
            this.loading = false;
          },
          () => {
            this.loading = false;
          }
        )
    );
  }

  getGuestConfig() {
    const queries = {
      entityId: this.entityId,
      toDate: this.reservationInfoControls.to.value,
      fromDate: this.reservationInfoControls.from.value,
      entityState: 'ALL',
      type: 'GUEST',
    };
    return queries;
  }

  getRoomTypeConfig() {
    const queries = {
      type: EntitySubType.ROOM_TYPE,
      toDate: this.reservationInfoControls.to.value,
      fromDate: this.reservationInfoControls.from.value,
      createBooking: true,
      raw: true,
      roomTypeStatus: true,
    };
    return queries;
  }

  getCountryCode(): void {
    this.$subscription.add(
      this.configService
        .getColorAndIconConfig(this.entityId)
        .subscribe((response) => {
          this.configData = new BookingConfig().deserialize(
            response.bookingConfig
          );
        })
    );
  }

  // Patch data for selected room type
  roomTypeChange(event: RoomTypeResponse) {
    if (event) {
      const data = new RoomTypeForm().deserialize(event);
      this.setRoomInfo(data);
    }
  }

  setRoomInfo(selectedRoomType) {
    this.roomControls.roomNumber.enable();
    this.roomControls.ratePlan.enable();

    this.ratePlans = selectedRoomType?.allRatePlans.map((res) => ({
      label: res.label,
      value: res.value,
    }));
    this.roomOptions = selectedRoomType?.rooms.map((room) => ({
      label: room.roomNumber,
      value: room.roomNumber,
    }));
    this.inputControls.roomInformation.patchValue({
      ratePlan: this.ratePlans[0].value,
      adultCount: 1,
      childCount: 0,
    });
  }

  guestChange(event: GuestType) {
    // this.selectedGuest = {
    //   label: `${event.firstName} ${event.lastName}`,
    //   value: event.id,
    //   phoneNumber: event.contactDetails.contactNumber,
    //   cc: event.contactDetails.cc,
    //   email: event.contactDetails.emailId,
    // };
  }

  listenForSourceChanges() {
    const sourceControl = this.reservationInfoControls.source;
    const sourceNameControl = this.reservationInfoControls.sourceName;

    sourceControl.valueChanges.subscribe((res) => {
      // this.agentSource = res === 'AGENT';
      this.otaOptions =
        res === 'OTA' && this.configData
          ? this.configData.source.filter((item) => item.value === res)[0].type
          : [];
      if (!this.editMode) {
        sourceNameControl.reset();
      }
    });

    this.$subscription.add(
      this.formService.sourceData.subscribe((res) => {
        if (res && this.configData) {
          this.editMode = true;
          sourceControl.setValue(res.source);
          sourceNameControl.setValue(res.sourceName);
        }
      })
    );
  }

  calculateDailyPrice() {
    const fromDate = this.reservationData.reservationInformation.from;
    const toDate = this.reservationData.reservationInformation.to;

    if (fromDate !== null && toDate !== null) {
      // Calculate the difference in days
      const millisecondsPerDay = 24 * 60 * 60 * 1000;
      const daysDifference = Math.round(
        (toDate - fromDate) / millisecondsPerDay
      );
      const totalAmount = this.reservationData?.totalAmount;
      const dailyPrice = daysDifference > 0 ? totalAmount / daysDifference : 0;

      this.useForm.patchValue({
        dailyPrice: dailyPrice.toFixed(2), // Optionally format to two decimal places
      });
      this.inputControls.dailyPrice.disable();
    }
  }

  handleSubmit() {
    if (this.useForm.invalid && !this.reservationId) {
      this.useForm.markAllAsTouched();
      this.snackbarService.openSnackBarAsText(
        'Invalid form: Please fix errors'
      );
      return;
    }

    const data = this.formService.mapRoomReservationData(
      this.useForm.getRawValue(),
      this.entityId,
      'quick'
    );
    this.loading = true;

    if (this.reservationId) {
      this.updateReservation(data);
    } else this.createReservation(data);
  }

  createReservation(data: any): void {
    this.isBooking = true;
    const { id, ...formData } = data;
    this.$subscription.add(
      this.manageReservationService
        .createReservation(this.entityId, formData, 'ROOM_TYPE')
        .subscribe(
          (res) => {
            this.handleSuccess();
          },
          (error) => {
            this.isBooking = false;
            this.errorMessage = error.error.message;
          },
          () => {
            this.isBooking = false;
          }
        )
    );
  }

  createGuest() {
    const lazyModulePromise = import(
      'libs/admin/guests/src/lib/admin-guests.module'
    )
      .then((module) => {
        return this.compiler.compileModuleAsync(module.AdminGuestsModule);
      })
      .catch((error) => {
        console.error('Error loading the lazy module:', error);
      });
    lazyModulePromise.then((moduleFactory) => {
      this.sidebarVisible = true;
      const factory = this.resolver.resolveComponentFactory(AddGuestComponent);
      this.sidebarSlide.clear();
      const componentRef = this.sidebarSlide.createComponent(factory);
      componentRef.instance.isSideBar = true;
      componentRef.instance.onClose.subscribe((res) => {
        this.sidebarVisible = false;
        if (typeof res !== 'boolean') {
          this.selectedGuest = {
            label: `${res.firstName} ${res.lastName}`,
            value: res.id,
            phoneNumber: res.contactDetails.contactNumber,
            cc: res.contactDetails.cc,
            email: res.contactDetails.emailId,
          };
          this.inputControls.guestInformation
            .get('guestDetails')
            .patchValue(res.id);
        }
        componentRef.destroy();
      });
    });
  }

  updateReservation(data: any): void {
    this.isBooking = true;
    this.$subscription.add(
      this.manageReservationService
        .updateReservation(this.entityId, this.reservationId, data, 'ROOM_TYPE')
        .subscribe(
          (res) => {
            this.handleSuccess();
          },
          (error) => {
            this.isBooking = false;
            this.errorMessage = error.error.message;
          },
          () => {
            this.isBooking = false;
          }
        )
    );
  }

  openNewWindow(url: string) {
    window.open(url);
  }

  handleSuccess = () => {
    this.loading = false;
    this.snackbarService.openSnackBarAsText(
      `Reservation ${this.reservationId ? 'Updated' : 'Created'} Successfully`,
      '',
      { panelClass: 'success' }
    );
    this.onCloseSidebar.emit(true);
  };

  handleError = (error) => {
    this.loading = false;
  };

  resetForm() {
    this.useForm.reset();
  }

  /**
   * @function ngOnDestroy to unsubscribe subscription.
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }

  get inputControls() {
    return this.useForm.controls as Record<
      keyof QuickReservationForm,
      AbstractControl
    >;
  }

  get reservationInfoControls() {
    return (this.useForm.get('reservationInformation') as FormGroup)
      .controls as Record<
      keyof QuickReservationForm['reservationInformation'],
      AbstractControl
    >;
  }

  get roomControls() {
    return (this.useForm.get('roomInformation') as FormGroup)
      .controls as Record<
      keyof QuickReservationForm['roomInformation'],
      AbstractControl
    >;
  }
}

export type QuickReservationConfig = {
  reservationId?: string;
  selectedRoom?: string;
  defaultRoomType?: IGRoomType;
  date?: IGCol;
};
