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
  AdminUtilityService,
  BookingDetailService,
  ConfigService,
  EntitySubType,
  ModuleNames,
  Option,
  QueryConfig,
  manageMaskZIndex,
  openModal,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import {
  BookingConfig,
  ReservationCurrentStatus,
  ReservationFormData,
} from 'libs/admin/manage-reservation/src/lib/models/reservations.model';
import { ManageReservationService } from 'libs/admin/manage-reservation/src/lib/services/manage-reservation.service';
import { FormService } from 'libs/admin/manage-reservation/src/lib/services/form.service';
import { IGCol } from 'libs/admin/shared/src/lib/components/interactive-grid/interactive-grid.component';
import { Subscription } from 'rxjs';
import { RoomTypeResponse } from 'libs/admin/room/src/lib/types/service-response';
import { GuestType } from 'libs/admin/guests/src/lib/types/guest.type';
import { RoomTypeOption } from 'libs/admin/manage-reservation/src/lib/constants/reservation';
import { AgentTableResponse } from 'libs/admin/agent/src/lib/types/response';
import {
  ReservationForm,
  SessionType,
} from 'libs/admin/manage-reservation/src/lib/constants/form';
import { debounceTime } from 'rxjs/operators';
import { BookingInfoComponent } from '../booking-info/booking-info.component';
import { ReservationRatePlan } from 'libs/admin/room/src/lib/constant/form';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { RoutesConfigService } from 'apps/admin/src/app/core/theme/src/lib/services/routes-config.service';
import { ManualOffer } from 'libs/admin/manage-reservation/src/lib/components/form-components/booking-summary/booking-summary.component';
import { AddGuestComponent } from 'libs/admin/guests/src/lib/components';
import { RoomReservationFormData } from 'libs/admin/manage-reservation/src/lib/types/forms.types';
import { ReservationType } from 'libs/admin/manage-reservation/src/lib/constants/reservation-table';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AddRefundComponent } from 'libs/admin/invoice/src/lib/components/add-refund/add-refund.component';
import { secondsToHHMM } from '../../constants/reservation';

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
  reservationNumber: string;

  ratePlans: Option[] = [];
  roomOptions: Option[] = [];
  otaOptions: Option[] = [];

  globalQueries = [];

  loading: boolean = false;
  isDataLoaded: boolean = false;
  isBooking = false;
  reinitializeRooms = false;
  isExternalBooking = false;
  isCheckinCompleted = false;
  isCheckedout = false;
  initItems = false;
  isPrePatchedRoomType: boolean = false;

  selectedGuest: Option;
  defaultRoomTypeId: string;
  selectedRoomType: RoomTypeOption;
  selectedAgent: AgentTableResponse;
  bookingSlotList: Option[];
  sessionType: SessionType;

  selectedRoom: string;
  date: IGCol;

  guestDetails: GuestDetails;
  configData: BookingConfig;
  reservationData: ReservationFormData;

  $subscription = new Subscription();
  offerResponse: ManualOffer;

  isSidebar = false;
  sidebarVisible: boolean = false;
  @ViewChild('sidebarSlide', { read: ViewContainerRef })
  sidebarSlide: ViewContainerRef;

  @ViewChild('bookingInfo')
  bookingInfo: BookingInfoComponent;

  @Input() set isNewBooking(value: boolean) {
    if (value === true) {
      this.isDataLoaded = true;
      this.isPrePatchedRoomType = true;
      this.initItems = true;
    }
  }

  @Output() onCloseSidebar = new EventEmitter<boolean>(false);
  @Input() set reservationConfig(value: QuickReservationConfig) {
    for (const key in value) {
      const val = value[key];
      this[key] = val;
    }
    if (this.defaultRoomTypeId) this.initDetails();
  }

  constructor(
    private fb: FormBuilder,
    private snackbarService: SnackBarService,
    private configService: ConfigService,
    private globalFilterService: GlobalFilterService,
    private manageReservationService: ManageReservationService,
    protected formService: FormService,
    protected routesConfigService: RoutesConfigService,
    public bookingDetailService: BookingDetailService,
    private compiler: Compiler,
    private resolver: ComponentFactoryResolver,
    public dialogService: DialogService,
    private adminUtilityService: AdminUtilityService
  ) {
    this.formService.resetData();
    this.initForm();
  }

  ngOnInit(): void {
    this.listenForGlobalFilters();
  }

  initDetails() {
    if (this.reservationId) {
      this.initReservationDetails();
      this.roomControls.roomTypeId.disable({ emitEvent: false });
    } else {
      this.isDataLoaded = true;
      this.initItems = true;
      this.inputControls.roomInformation.patchValue({
        roomTypeId: this.defaultRoomTypeId,
        roomNumber: this.selectedRoom,
        roomNumbers: [this.selectedRoom],
      });
      this.inputControls.reservationInformation.patchValue({
        sessionType: this.sessionType,
      });
    }
  }

  listenForDateChanges() {
    this.$subscription.add(
      this.formService.reinitializeRooms.subscribe((res) => {
        if (res) {
          this.reinitializeRooms = !this.reinitializeRooms;
        }
      })
    );
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
        companySourceName: [''],
        sessionType: [
          this.isDayBookingAvailable
            ? SessionType.DAY_BOOKING
            : SessionType.NIGHT_BOOKING,
          Validators.required,
        ],
        slotId: [''],
      }),

      roomInformation: this.fb.group({
        roomTypeId: ['', [Validators.required]],
        ratePlanId: [''],
        roomNumber: [''],
        roomNumbers: [[]],
        adultCount: ['', [Validators.required, Validators.min(1)]],
        childCount: ['', [Validators.min(0)]],
        id: [''],
      }),

      instructions: this.fb.group({
        specialInstructions: [''],
      }),

      paymentRule: this.fb.group({
        amountToPay: [0],
        deductedAmount: [''],
        makePaymentBefore: [''],
        inclusionsAndTerms: [''],
        type: ['FLAT'],
      }),

      guestInformation: this.fb.group({
        guestDetails: ['', [Validators.required]],
      }),

      dailyPrice: [''],
      rateImprovement: [false],
    });

    this.entityId = this.globalFilterService.entityId;
    this.listenForDateChanges();
    this.listenForRoomChanges();
    this.listenForRoomTypeChanges();
  }

  listenForRoomChanges() {
    let roomCount = 0;

    const updateRateImprovement = () => {
      this.reservationId &&
        this.isDataLoaded &&
        this.inputControls.rateImprovement.patchValue(true, {
          emitEvent: false,
        });
    };

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
    this.roomControls.adultCount.valueChanges.subscribe((res) => {
      res && updateRateImprovement();
    });
    this.roomControls.childCount.valueChanges.subscribe((res) => {
      res && updateRateImprovement();
    });
  }

  close(): void {
    this.onCloseSidebar.emit(false);
  }

  editForm() {
    const roomTypeData: ReservationForm & {
      guestData: Option;
    } = this.userForm.getRawValue();
    roomTypeData.guestData = {
      label: this.selectedGuest?.label,
      value: this.selectedGuest?.value,
    };
    roomTypeData.roomInformation.roomCount =
      roomTypeData?.roomInformation?.roomNumbers?.length ?? 1;
    roomTypeData.agent = this.bookingInfo?.selectedAgent;
    roomTypeData.company = this.bookingInfo?.selectedCompany;

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
        .pipe(debounceTime(100))
        .subscribe(
          (res) => {
            const formData = new ReservationFormData().deserialize(res);
            this.reservationData = formData;
            this.reservationNumber = res?.reservationNumber;
            this.isExternalBooking = res?.externalBooking;
            this.formService.currentJourneyStatus.next(res.status);
            this.calculateDailyPrice();
            const { roomInformation, guestInformation, ...data } = formData;
            this.guestDetails = {
              guestName:
                res.guest.firstName +
                ' ' +
                (res.guest?.lastName ? res.guest.lastName : ''),
              phoneNumber: res.guest?.contactDetails?.contactNumber
                ? res.guest?.contactDetails?.cc +
                  '' +
                  res.guest?.contactDetails?.contactNumber
                : null,
              id: res.guest?.id ?? '',
              cc: res.guest?.contactDetails.cc,
              contactNumber: res.guest?.contactDetails?.contactNumber,
              email: res.guest?.contactDetails?.emailId,
            };
            if (res?.offer?.offerType === 'MANUAL')
              this.offerResponse = {
                offerType: res.offer?.offerType,
                discountType: res.offer?.discountType,
                discountValue: res.offer?.discountValue,
              };
            this.inputControls.guestInformation
              .get('guestDetails')
              .patchValue(res.guest.id);
            this.selectedGuest = {
              label: `${res?.guest?.firstName} ${res?.guest?.lastName}`,
              value: res?.guest?.id,
            };
            this.formService.initSourceData(formData.reservationInformation, {
              agent: formData.agent,
              company: formData?.company,
            });
            this.userForm.patchValue(data);
            this.inputControls.roomInformation.patchValue(roomInformation[0]);
            this.initItems = true;
            this.isCheckinCompleted =
              res?.status === ReservationCurrentStatus.INHOUSE;
            this.isCheckedout =
              res.status === ReservationCurrentStatus.CHECKEDOUT;
            this.setFormDisability();
            this.listenForRoomChanges();
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

  setFormDisability() {
    if (this.isExternalBooking) {
      this.userForm.disable({ emitEvent: false });
      this.roomControls.roomNumber.enable({ emitEvent: false });
    }
    if (this.isCheckinCompleted) {
      this.userForm.disable({ emitEvent: false });
      this.reservationInfoControls.to.enable({ emitEvent: false });
    }
    if (
      this.reservationData.reservationInformation.reservationType ===
      ReservationType.CONFIRMED
    ) {
      [
        'source',
        'sourceName',
        'otaSourceName',
        'agentSourceName',
        'companySourceName',
      ].forEach((controlName) => {
        this.inputControls.reservationInformation
          .get(controlName)
          .disable({ emitEvent: false });
      });
    }
    this.isCheckedout && this.userForm.disable();
    this.reservationInfoControls.sessionType.disable();
  }

  getGuestConfig() {
    const queries = {
      entityId: this.entityId,
      toDate: this.reservationInfoControls.to.value,
      fromDate: this.reservationInfoControls.from.value,
      entityState: 'ALL',
      type: 'GUEST,NON_RESIDENT_GUEST',
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
        ) &&
        !this.reservationId
      )
        this.roomControls.roomNumbers.reset();
      this.setRoomInfo();
    }
  }

  setRoomInfo() {
    if (this.selectedRoomType) {
      this.ratePlans =
        (this.selectedRoomType?.ratePlans as ReservationRatePlan[]) ?? [];
      this.roomOptions = this.selectedRoomType?.rooms.map((room) => ({
        label: room?.roomNumber,
        value: room?.roomNumber,
      }));
      !this.reservationId &&
        this.inputControls.roomInformation.patchValue({
          ratePlanId: this.ratePlans?.filter((rateplan) => rateplan.isBase)[0]
            .value,
          adultCount: 1,
          childCount: 0,
        });
    }
    if (this.reservationId) {
      const roomNumber = this.roomControls.roomNumber.value;
      this.roomOptions.unshift({ label: roomNumber, value: roomNumber });
    }
  }

  guestChange(event: GuestType) {
    if (event && event?.id) {
      this.selectedGuest = {
        label: `${event.firstName} ${event.lastName}`,
        value: event.id,
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
      this.inputControls.dailyPrice.disable({ emitEvent: false });
    }
  }

  handleSubmit() {
    if (this.userForm.invalid && !this.reservationId) {
      this.userForm.markAllAsTouched();
      this.snackbarService.openSnackBarAsText(
        'Please check data and try again !'
      );
      return;
    }

    const data = this.formService.mapRoomReservationData(
      this.userForm.getRawValue(),
      this.entityId,
      'quick',
      undefined,
      this.offerResponse
    );
    this.loading = true;

    if (this.reservationId) {
      this.inputControls.rateImprovement.value
        ? this.rateImprovement(data)
        : this.updateReservation(data);
    } else this.createReservation(data);
  }

  rateImprovement(data: RoomReservationFormData) {
    this.manageReservationService
      .rateImprovement(this.entityId, this.reservationId, data)
      .subscribe((res) => {
        if (res?.chargedAmount > 0) {
          let modalRef: DynamicDialogRef;
          const modalData: Partial<AddRefundComponent> = {
            heading: 'Update Reservation',
            isReservationPopup: true,
            chargedAmount: res.chargedAmount,
          };
          modalRef = openModal({
            config: {
              width: '40%',
              styleClass: 'confirm-dialog',
              data: modalData,
            },
            component: AddRefundComponent,
            dialogService: this.dialogService,
          });

          modalRef.onClose.subscribe(
            (res: { chargedAmount: number; remarks: string }) => {
              if (res) {
                this.updateReservation({
                  chargedAmount: res?.chargedAmount,
                  remarks: res?.remarks,
                  ...data,
                });
              }
            }
          );
        } else {
          this.updateReservation({
            chargedAmount: res?.chargedAmount,
            ...data,
          });
        }
      });
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
      componentRef.instance.isSidebar = true;
      manageMaskZIndex();
      componentRef.instance.onCloseSidebar.subscribe((res) => {
        this.sidebarVisible = false;
        if (typeof res !== 'boolean') {
          this.selectedGuest = {
            label: `${res.firstName} ${res.lastName}`,
            value: res.id,
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

  listenForSessionTypeChanges() {
    this.reservationInfoControls.sessionType.valueChanges.subscribe(
      (sessionType) => {
        if (sessionType === SessionType.DAY_BOOKING) {
          this.handleDayBooking();
        } else {
          this.handleNightBooking();
        }
      }
    );
  }

  handleDayBooking() {
    this.reservationInfoControls.to.patchValue(null);
    this.reservationInfoControls.slotId.setValidators(Validators.required);
    this.reservationInfoControls.to.clearValidators();
    this.reservationInfoControls.slotId.updateValueAndValidity();
  }

  handleNightBooking() {
    this.reservationInfoControls.slotId.clearValidators();
    this.reservationInfoControls.to.setValidators(Validators.required);
    this.reservationInfoControls.slotId.updateValueAndValidity();

    this.reservationInfoControls.slotId.patchValue(null);

    const nextDay = new Date(this.reservationInfoControls.from.value);
    nextDay.setDate(nextDay.getDate() + 1);
    this.reservationInfoControls.to.patchValue(nextDay.getTime());
  }

  listenForRoomTypeChanges() {
    this.roomControls.roomTypeId.valueChanges.subscribe((res) => {
      if (res) this.getSlotListByRoomTypeId(res);
    });
  }

  getSlotListByRoomTypeId(roomTypeId: string) {
    const config: QueryConfig = {
      params: this.adminUtilityService.makeQueryParams([
        {
          entityId: this.entityId,
          inventoryId: roomTypeId,
          raw: true,
          status: true,
        },
      ]),
    };
    this.$subscription.add(
      this.manageReservationService
        .getSlotsListsByRoomType(config)
        .subscribe((res) => {
          if (res) {
            this.bookingSlotList = res.map((slot) => {
              return {
                label: secondsToHHMM(slot.duration),
                value: slot.id,
                itemAmount: slot.bookingSlotPrices[0].price,
              };
            });
            this.reservationInfoControls.slotId.patchValue(
              this.bookingSlotList[0].value
            );
          }
        })
    );
  }

  openDetailsPage() {
    this.bookingDetailService.openBookingDetailSidebar({
      tabKey: 'guest_details',
      bookingId: this.reservationId,
    });
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

  get sessionTypeControl() {
    return this.reservationInfoControls.sessionType as AbstractControl;
  }

  get isDayBooking() {
    return this.sessionTypeControl?.value === SessionType.DAY_BOOKING;
  }

  get isDayBookingAvailable(): boolean {
    return this.configService.$isDayBookingAvailable.value;
  }
}

export type QuickReservationConfig = {
  reservationId?: string;
  selectedRoom?: string;
  defaultRoomTypeId?: string;
  date?: IGCol;
  sessionType: SessionType;
};

export type GuestDetails = {
  id: string;
  guestName: string;
  phoneNumber: string;
  email: string;
  cc?: string;
  contactNumber?: string;
};
