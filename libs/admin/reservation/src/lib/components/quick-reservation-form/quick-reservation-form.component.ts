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
import {
  ModalService,
  SnackBarService,
} from '@hospitality-bot/shared/material';
import {
  BookingConfig,
  ReservationFormData,
} from 'libs/admin/manage-reservation/src/lib/models/reservations.model';
import { ManageReservationService } from 'libs/admin/manage-reservation/src/lib/services/manage-reservation.service';
import { GuestDetails } from '../../../../../dashboard/src/lib/data-models/reservation.model';
import { FormService } from 'libs/admin/manage-reservation/src/lib/services/form.service';
import { IGRoomType } from '../reservation-calendar-view/reservation-calendar-view.component';
import { IGCol } from 'libs/admin/shared/src/lib/components/interactive-grid/interactive-grid.component';
import { Subscription } from 'rxjs';
import { AddGuestComponent } from 'libs/admin/guests/src/lib/components/add-guest/add-guest.component';
import { RoomTypeResponse } from 'libs/admin/room/src/lib/types/service-response';
import { GuestType } from 'libs/admin/guests/src/lib/types/guest.type';
import { RoomFieldTypeOption } from 'libs/admin/manage-reservation/src/lib/constants/reservation';
import { MatDialogConfig } from '@angular/material/dialog';
import { DetailsComponent } from '../details/details.component';
import { AgentTableResponse } from 'libs/admin/agent/src/lib/types/response';
import { ReservationForm } from 'libs/admin/manage-reservation/src/lib/constants/form';

@Component({
  selector: 'hospitality-bot-quick-reservation-form',
  templateUrl: './quick-reservation-form.component.html',
  styleUrls: ['./quick-reservation-form.component.scss'],
})
export class QuickReservationFormComponent implements OnInit {
  pageTitle = 'Add Item';
  navRoutes = [{ label: 'Add Item', link: './' }];

  userForm: FormGroup;

  startMinDate = new Date();
  endMinDate = new Date();

  entityId: string;
  reservationId: string;

  ratePlans: Option[] = [];
  roomOptions: Option[] = [];
  otaOptions: Option[] = [];

  globalQueries = [];

  loading: boolean = false;
  isDataLoaded: boolean = false;
  isBooking = false;
  reinitializeRooms = false;
  isExternalBooking = false;

  selectedGuest: Option;
  defaultRoomType: IGRoomType;
  selectedRoomType: RoomFieldTypeOption;
  selectedAgent: AgentTableResponse;

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

  fromDateValue = new Date();
  toDateValue = new Date();
  @Input() set isNewBooking(value: boolean) {
    if (value === true) {
      this.isDataLoaded = true;
    }
  }

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
    private manageReservationService: ManageReservationService,
    private formService: FormService,
    private compiler: Compiler,
    private resolver: ComponentFactoryResolver,
    private routesConfigService: RoutesConfigService,
    private modalService: ModalService
  ) {
    this.formService.resetData();
    this.initForm();
  }

  ngOnInit(): void {
    this.listenForGlobalFilters();
    this.initDefaultDate();
  }

  initDetails() {
    if (this.reservationId) {
      this.initReservationDetails();
    } else {
      this.isDataLoaded = true;
      this.listenForRoomChanges();
      this.inputControls.roomInformation.patchValue({
        roomTypeId: this.defaultRoomType.value,
        roomNumber: this.selectedRoom,
        roomNumbers: [this.selectedRoom],
      });
      this.setRoomInfo(this.defaultRoomType);
    }
  }

  initDefaultDate() {
    const fromDate = this.date ? new Date(this.date) : new Date(); // Convert epoch to milliseconds
    const toDate = new Date(fromDate);
    toDate.setDate(fromDate.getDate() + 1); // Add 1 day

    this.inputControls.reservationInformation.patchValue({
      from: fromDate.getTime(),
      to: toDate.getTime(),
    });
  }

  listenForDateChanges() {
    this.formService.reinitializeRooms.subscribe((res) => {
      if (res) {
        this.reinitializeRooms = !this.reinitializeRooms;
      }
    });
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

  initForm() {
    this.userForm = this.fb.group({
      reservationInformation: this.fb.group({
        from: ['', Validators.required],
        to: ['', Validators.required],
        source: ['', Validators.required],
        sourceName: ['', [Validators.required, Validators.maxLength(60)]],
        marketSegment: ['', Validators.required],
        agentSourceName: [''],
        otaSourceName: [''],
      }),

      roomInformation: this.fb.group({
        roomTypeId: ['', [Validators.required]],
        ratePlan: [''],
        roomNumber: [''],
        roomNumbers: [[]],
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
    this.listenForDateChanges();
  }

  listenForRoomChanges() {
    let roomCount = 0;
    this.roomControls.roomNumbers.valueChanges.subscribe((res) => {
      if (res) {
        const currentRoomCount = res.length ? res.length : 1;
        const previousRoomCount = roomCount;
        let previousAdulCount = this.roomControls.adultCount.value;

        // Update roomCount
        roomCount = currentRoomCount;
        // Update adultCount only if room count is increased
        if (
          currentRoomCount > previousRoomCount &&
          currentRoomCount > previousAdulCount
        ) {
          this.roomControls.adultCount.setValue(currentRoomCount, {
            emitEvent: false,
          });
        }
      }
    });
  }

  close(): void {
    this.onCloseSidebar.emit(false);
  }

  editForm() {
    const roomTypeData: ReservationForm = this.userForm.getRawValue();
    let queryParams: any = {
      entityId: this.entityId,
    };
    if (!this.reservationId) {
      queryParams = {
        entityId: this.entityId,
        data: btoa(JSON.stringify(roomTypeData)),
      };
    }
    this.routesConfigService.navigate({
      subModuleName: ModuleNames.ADD_RESERVATION,
      additionalPath: this.reservationId
        ? `edit-reservation/${this.reservationId}`
        : `add-reservation`,
      queryParams,
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
            this.isExternalBooking = res?.externalBooking;
            if (this.isExternalBooking) {
              this.userForm.disable();
              this.roomControls.roomNumber.enable();
            }
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
            this.formService.sourceData.next({
              source: data.reservationInformation.source,
              sourceName: data.reservationInformation.sourceName,
              agent: res?.agent ?? null,
              marketSegment: data.reservationInformation?.marketSegment,
            });
            this.roomOptions = this.defaultRoomType.rooms.map((room) => ({
              label: room.roomNumber.toString(),
              value: room.roomNumber.toString(),
            }));

            this.userForm.patchValue(data);
            this.inputControls.roomInformation.patchValue(roomInformation[0]);

            this.isDataLoaded = true;
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

  // Patch data for selected room type
  roomTypeChange(event: RoomTypeResponse) {
    if (event && event.id) {
      this.selectedRoomType = this.formService.setReservationRoomType(event);
      if (
        !this.selectedRoomType?.rooms.some(
          (item) => item?.value === this.selectedRoom
        )
      )
        this.roomControls.roomNumbers.reset();
      this.setRoomInfo();
    }
  }

  setRoomInfo(defaultRoomType?: IGRoomType) {
    if (defaultRoomType || this.selectedRoomType) {
      const roomType = defaultRoomType
        ? defaultRoomType
        : this.selectedRoomType;
      this.ratePlans = ((roomType?.ratePlans as Option[]) ?? []).map((res) => ({
        label: res.label,
        value: res.value,
        isBase: res.isBase,
      }));
      this.roomOptions = ((roomType?.rooms as Option[]) ?? []).map((room) => ({
        label: room?.roomNumber,
        value: room?.roomNumber,
      }));
      this.inputControls.roomInformation.patchValue({
        ratePlan: this.ratePlans?.filter((rateplan) => rateplan.isBase)[0]
          .value,
        adultCount: 1,
        childCount: 0,
      });
    }
  }

  guestChange(event: GuestType) {
    if (event && event?.id) {
      this.selectedGuest = {
        label: `${event.firstName} ${event.lastName}`,
        value: event.id,
        phoneNumber: event.contactDetails.contactNumber,
        cc: event.contactDetails.cc,
        email: event.contactDetails.emailId,
      };
    }
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

      this.userForm.patchValue({
        dailyPrice: dailyPrice.toFixed(2), // Optionally format to two decimal places
      });
      this.inputControls.dailyPrice.disable();
    }
  }

  handleSubmit() {
    if (this.userForm.invalid && !this.reservationId) {
      this.userForm.markAllAsTouched();
      this.snackbarService.openSnackBarAsText(
        'Invalid form: Please fix errors'
      );
      return;
    }

    const data = this.formService.mapRoomReservationData(
      this.userForm.getRawValue(),
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
          },
          () => {
            this.isBooking = false;
          }
        )
    );
  }

  openDetailsPage() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '100%';
    const detailCompRef = this.modalService.openDialog(
      DetailsComponent,
      dialogConfig
    );

    detailCompRef.componentInstance.bookingId = this.reservationId;
    detailCompRef.componentInstance.tabKey = 'payment_details';
    this.increaseZIndex(true);
    this.$subscription.add(
      detailCompRef.componentInstance.onDetailsClose.subscribe((res) => {
        this.increaseZIndex(false);
        detailCompRef.close();
      })
    );
  }

  increaseZIndex(toggleZIndex: boolean) {
    const cdkOverlayContainer = document.querySelector(
      '.cdk-overlay-container'
    ) as HTMLElement;
    if (cdkOverlayContainer)
      cdkOverlayContainer.style.zIndex = toggleZIndex ? '1500' : '1000';
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
    this.userForm.reset();
  }

  /**
   * @function ngOnDestroy to unsubscribe subscription.
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }

  get inputControls() {
    return this.userForm.controls as Record<
      keyof ReservationForm,
      AbstractControl
    >;
  }

  get reservationInfoControls() {
    return (this.userForm.get('reservationInformation') as FormGroup)
      .controls as Record<
      keyof ReservationForm['reservationInformation'],
      AbstractControl
    >;
  }

  get roomControls() {
    return (this.userForm.get('roomInformation') as FormGroup)
      .controls as Record<
      keyof ReservationForm['roomInformation'],
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
