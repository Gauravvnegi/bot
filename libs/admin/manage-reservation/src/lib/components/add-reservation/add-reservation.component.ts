import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  OfferData,
  OfferList,
  ReservationCurrentStatus,
  ReservationFormData,
  SummaryData,
} from '../../models/reservations.model';
import { ManageReservationService } from '../../services/manage-reservation.service';
import {
  AdminUtilityService,
  ConfigService,
  EntitySubType,
  HotelDetailService,
  Option,
  QueryConfig,
} from '@hospitality-bot/admin/shared';
import {
  JourneyState,
  roomReservationTypes,
} from '../../constants/reservation';
import { FormService } from '../../services/form.service';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { OccupancyDetails, ReservationSummary } from '../../types/forms.types';
import {
  BookingItemsSummary,
  RoomReservationResponse,
} from '../../types/response.type';
import { BaseReservationComponent } from '../../../../../reservation/src/lib/components/base-reservation.component';
import { ReservationType } from '../../constants/reservation-table';
import { convertToTitleCase } from 'libs/admin/shared/src/lib/utils/valueFormatter';
import { Subject } from 'rxjs';
import {
  GlobalFilterService,
  RoutesConfigService,
} from '@hospitality-bot/admin/core/theme';
import {
  ReservationForm,
  RoomInformation,
  SessionType,
} from '../../constants/form';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { ManualOffer } from '../form-components/booking-summary/booking-summary.component';
import { secondsToHHMM } from 'libs/admin/reservation/src/lib/constants/reservation';

@Component({
  selector: 'hospitality-bot-add-reservation',
  templateUrl: './add-reservation.component.html',
  styleUrls: ['./add-reservation.component.scss', '../reservation.styles.scss'],
})
export class AddReservationComponent extends BaseReservationComponent
  implements OnInit, OnDestroy {
  roomTypeValues = [];
  reservationTypes: Option[] = [];
  roomTypeIds: string[] = [];
  expandAccordion = false;

  // Booking Summary props
  occupancyDetails: OccupancyDetails = {
    adultCount: 0,
    childCount: 0,
    roomCount: 0,
  };
  checkinJourneyState: JourneyState;
  cancelOfferRequests$ = new Subject<void>();
  isDraftBooking = false;
  isConfirmedBooking = false;
  isCheckedout = false;
  isFullPayment = false;
  isDataInitialized = false;
  isRouteData = false;
  currentStatus: ReservationCurrentStatus;
  reservationFormData: ReservationFormData;
  offerResponse: ManualOffer;
  loadSummary: boolean = false;
  bookingSlotList: Option[];
  readonly sessionType = SessionType;

  constructor(
    private fb: FormBuilder,
    private adminUtilityService: AdminUtilityService,
    private manageReservationService: ManageReservationService,
    protected activatedRoute: ActivatedRoute,
    protected formService: FormService,
    protected hotelDetailService: HotelDetailService,
    protected routesConfigService: RoutesConfigService,
    private snackbarService: SnackBarService,
    private globalFilterService: GlobalFilterService,
    private configService: ConfigService
  ) {
    super(activatedRoute, hotelDetailService, formService, routesConfigService);
    this.initForm();
  }

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.initDetails();
    this.initFormData();
    this.listenRouteData();
    this.listenForSlotChanges();
    if (!this.reservationId) this.listenForSessionTypeChanges();
  }

  initDetails() {
    this.listenFormServiceChanges();
    this.reservationTypes = roomReservationTypes;
    if (this.reservationId) {
      this.getReservationDetails();
    }
  }

  listenRouteData() {
    this.$subscription.add(
      this.activatedRoute.queryParams
        .pipe(debounceTime(100))
        .subscribe((queryParams) => {
          if (queryParams.data) {
            const data = queryParams.data;
            const paramsData = JSON.parse(atob(data));
            this.initParamsData(paramsData);
          }
        })
    );
  }

  initParamsData(
    paramsData: ReservationForm & {
      guestData: Option;
      isCloneReservation?: boolean;
    }
  ) {
    const {
      roomInformation,
      guestInformation,
      reservationInformation: { source, sourceName, ...reservationInfo },
      reservationInformation,
      isCloneReservation,
      ...data
    } = paramsData;

    this.userForm.patchValue(
      {
        reservationInformation: reservationInfo,
        ...(isCloneReservation ? {} : data),
      },
      { emitEvent: false }
    );
    this.formService.initSourceData(reservationInformation, {
      company: data.company,
      agent: data.agent,
    });
    reservationInfo.reservationType !== ReservationType.DRAFT &&
      this.reservationInfoControls.reservationType.patchValue(
        ReservationType.CONFIRMED
      );
    this.isRouteData = true;

    // Remove id property from roomInformation for cloned reservation
    let updatedRoomInformation = (isCloneReservation
      ? Array.isArray(roomInformation)
        ? roomInformation.map(
            ({ id, roomNumber, roomNumbers, ...roomWithoutId }) => roomWithoutId
          )
        : { ...roomInformation, id: '', roomNumber: '', roomNumbers: [] }
      : [roomInformation]) as RoomInformation[];

    this.roomTypeValues = updatedRoomInformation;

    this.formService.guestInformation.next(paramsData.guestData);
  }

  listenFormServiceChanges() {
    this.expandAccordion = this.formService.enableAccordion;
    // Expand accordion for assign room from reservation table.
    if (this.expandAccordion) {
      this.formService.enableAccordion = false;
    }
    this.$subscription.add(
      this.formService.getSummary.subscribe((res) => {
        if (res) {
          if (this.roomInfoControls.valid && this.isDataInitialized) {
            this.getSummaryData();
          }
        }
      })
    );
  }

  /**
   * @function initForm Initialize form
   */
  initForm(): void {
    let startDate = this.reservationId ? '' : new Date();
    let toDate = this.reservationId ? '' : new Date();
    typeof toDate !== 'string' && toDate.setDate(toDate.getDate() + 1);
    this.userForm = this.fb.group({
      reservationInformation: this.fb.group({
        from: [startDate, Validators.required],
        to: [toDate, Validators.required],
        reservationType: ['', Validators.required],
        source: ['', Validators.required],
        sourceName: ['', [Validators.required, Validators.maxLength(60)]],
        otaSourceName: [''],
        agentSourceName: [''],
        companySourceName: [''],
        marketSegment: ['', Validators.required],
        sessionType: [
          this.isDayBookingAvailable
            ? SessionType.DAY_BOOKING
            : SessionType.NIGHT_BOOKING,
          Validators.required,
        ],
        slotId: [''],
      }),
      offerId: [''],
      instructions: this.fb.group({
        specialInstructions: [''],
      }),
      printRate: [true],
      rateImprovement: [false],
    });
  }

  listenRoomTypeChange() {
    this.reservationInfoControls.sessionType.value ===
      SessionType.DAY_BOOKING && this.getSlotListByRoomTypeId();
  }

  /**
   * @function listenForFormChanges Listen for form values changes.
   */
  listenForFormChanges(): void {
    this.formValueChanges = true;
    this.inputControls.roomInformation
      .get('roomTypes')
      .valueChanges.pipe(debounceTime(200))
      .subscribe((res) => {
        const data = this.inputControls.roomInformation.get(
          'roomTypes'
        ) as FormGroup;
        res = data.getRawValue();
        // Get raw value to get disabled control values as well

        // check if the last added room type is selected
        if (res && res[res.length - 1].roomTypeId?.length) {
          this.getSummaryData();
          this.isDataInitialized = true;
        }

        // Reset form data when all items are removed from roomArray.
        if (res[res.length - 1].roomTypeId === null) {
          this.resetFormData();
        }
      });
  }

  getSlotListByRoomTypeId() {
    const config: QueryConfig = {
      params: this.adminUtilityService.makeQueryParams([
        {
          entityId: this.entityId,
          inventoryId: this.roomControls[0].value.roomTypeId,
          raw: true,
          status: true,
        },
      ]),
    };

    this.$subscription.add(
      this.manageReservationService
        .getSlotsListsByRoomType(config)
        .subscribe((res) => {
          this.bookingSlotList = res.map((slot) => {
            return {
              label: secondsToHHMM(slot.duration),
              value: slot.id,
              itemAmount: slot.bookingSlotPrices[0].price,
              duration: slot.duration,
            };
          });
        })
    );
  }

  initFormData() {
    this.$subscription.add(
      this.formService.reservationForm
        .pipe(debounceTime(100))
        .subscribe((res) => {
          if (res) {
            const { roomInformation, ...formData } = res;
            // Will always be true as the data is not saved yet.
            this.isDraftBooking = true;
            this.formService.initSourceData(formData.reservationInformation, {
              agent: formData.agent,
              company: formData?.company,
            });
            // check if room type was patched
            if (roomInformation.roomTypes[0].roomTypeId.length)
              this.roomTypeValues = roomInformation.roomTypes;
            this.userForm.patchValue(formData, { emitEvent: false });
          }
        })
    );
  }

  getReservationDetails(): void {
    this.loadSummary = true;
    this.$subscription.add(
      this.manageReservationService
        .getReservationDataById(this.reservationId, this.entityId)
        .subscribe(
          (response: RoomReservationResponse) => {
            this.reservationFormData = new ReservationFormData().deserialize(
              response
            );
            const {
              guestInformation,
              roomInformation,
              nextStates,
              totalPaidAmount,
              reservationInformation: {
                source,
                sourceName,
                ...reservationInfo
              },
              ...formData
            } = this.reservationFormData;

            // Checks to disable form based on reservation type and journeys
            this.isDraftBooking =
              reservationInfo.reservationType === ReservationType.DRAFT;
            this.isConfirmedBooking =
              reservationInfo.reservationType === ReservationType.CONFIRMED;
            this.formService.currentJourneyStatus.next(response.status);
            this.currentStatus = response?.status;
            this.isCheckedout =
              response.status === ReservationCurrentStatus.CHECKEDOUT;
            this.checkinJourneyState = this.reservationFormData.journeyState;
            this.isExternalBooking = response.externalBooking;

            if (response?.offer?.offerType === 'MANUAL')
              this.offerResponse = {
                offerType: response.offer?.offerType,
                discountType: response.offer?.discountType,
                discountValue: response.offer?.discountValue,
              };
            // Init Source Data for booking info
            this.formService.initSourceData(
              this.reservationFormData.reservationInformation,
              { agent: formData.agent, company: formData?.company }
            );

            if (nextStates)
              this.reservationTypes = nextStates.map((item) => ({
                label: convertToTitleCase(item),
                value: item,
              }));

            this.totalPaidAmount = totalPaidAmount;
            this.formValueChanges = true;

            // Create options for room and guest if not already available
            // in room iterator and guest info component.
            this.roomTypeValues = roomInformation;
            this.formService.guestInformation.next({
              label: `${guestInformation?.firstName} ${guestInformation?.lastName}`,
              value: guestInformation.id,
            });
            this.userForm.patchValue({
              reservationInformation: reservationInfo,
              instructions: formData.instructions,
              paymentRule: formData.paymentRule,
              printRate: formData.printRate,
              formData,
            });
            this.inputControls.offerId.patchValue(
              this.reservationFormData.offerId
            );
            if (this.reservationFormData.offerId) {
              const roomTypeIds = roomInformation.map(
                (item) => item.roomTypeId
              );
              this.getOfferByRoomType(roomTypeIds);
            }
          },
          (error) => {
            this.loadSummary = false;
          }
        )
    );
  }

  getOfferByRoomType(roomTypeIds: string[]): void {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        {
          pagination: false,
          type: 'OFFER',
          source: 1,
          serviceIds: roomTypeIds,
          visibilitySource: 'ADMIN_PANEL',
        },
      ]),
    };
    // get offers for all roomTypes
    this.cancelOfferRequests$.next();

    if (roomTypeIds.length) {
      this.$subscription.add(
        this.manageReservationService
          .getOfferByRoomType(this.entityId, config)
          .pipe(
            //to cancel api call between using take until
            takeUntil(this.cancelOfferRequests$)
          )
          .subscribe(
            (response) => {
              this.offersList = new OfferList().deserialize(response);
              if (this.userForm.get('offerId').value) {
                this.selectedOffer = this.offersList.records.filter(
                  (item) => item.id === this.userForm.get('offerId').value
                )[0];
              }
            },
            (error) => {}
          )
      );
    }
  }

  offerSelect(offerData?: OfferData): void {
    if (offerData) {
      this.userForm.patchValue({ offerId: offerData.id }, { emitEvent: false });
      this.getSummaryData();
    } else {
      this.userForm.get('offerId').reset();
      this.getSummaryData();
    }
    this.selectedOffer = offerData;
  }

  getSummaryData(): void {
    this.cancelRequests$.next();
    const configData = this.getFormSummaryData();
    let isAdultAndRoomCount = configData.bookingItems.every((item) => {
      return item.occupancyDetails.maxAdult && item.roomDetails.roomCount;
    });

    // Here check if the slot id is selected in case of day booking.
    const isDayBookingWithSlotId =
      (configData.sessionType === SessionType.DAY_BOOKING &&
        configData.slotId) ||
      configData.sessionType === SessionType.NIGHT_BOOKING;

    if (
      isAdultAndRoomCount &&
      isDayBookingWithSlotId &&
      (!this.reservationId || configData.guestId)
    ) {
      this.loadSummary = true;
      this.$subscription.add(
        this.manageReservationService
          .getSummaryData(this.entityId, configData, {
            params: `?type=${EntitySubType.ROOM_TYPE}`,
          })
          .pipe(
            //to cancel api call between using take until
            takeUntil(this.cancelRequests$)
          )
          .subscribe(
            (res) => {
              this.summaryData = new SummaryData()?.deserialize(res);
              if (res?.offer?.offerType)
                this.formService.offerType.next(res?.offer?.offerType);
              // Modify data to show summary for occupancy details.
              this.updateBookingItemsCounts(this.summaryData.bookingItems);
              this.updatePaymentData();

              this.isFullPayment =
                this.paymentRuleControls.amountToPay.value ===
                this.summaryData.totalAmount;
              if (this.formValueChanges) {
                this.reservationId
                  ? this.setFormDisability(
                      this.checkinJourneyState,
                      this.currentStatus
                    )
                  : this.setFormDisability;
                this.formValueChanges = false;
              }
            },
            (error) => (this.loadSummary = false),
            () => (this.loadSummary = false)
          )
      );
      const roomTypeIds = configData.bookingItems.map(
        (item) => item.roomDetails.roomTypeId
      );
      // check if the last added room type is selected
      !this.isConfirmedBooking && this.getOfferByRoomType(roomTypeIds);
    }
  }

  getFormSummaryData() {
    // Summary data for booking summary
    const source = this.reservationInfoControls.source?.value;
    const data: ReservationSummary = {
      from: this.reservationInfoControls.from.value,
      to: this.reservationInfoControls.to.value,
      slotId: this.reservationInfoControls.slotId?.value?.length
        ? this.reservationInfoControls.slotId?.value
        : undefined,
      sessionType: this.reservationInfoControls.sessionType?.value,
      bookingItems: this.roomControls.map((item) => ({
        roomDetails: {
          ratePlan: {
            id: item.get('ratePlanId').value,
          },
          roomTypeId: item.get('roomTypeId').value,
          roomCount: item.get('roomCount').value,
        },
        occupancyDetails: {
          maxChildren: item.get('childCount').value,
          maxAdult: item.get('adultCount').value,
        },
        id: item.get('id').value,
      })),
      offerId: this.inputControls.offerId.value
        ? this.inputControls.offerId.value
        : undefined,
      guestId: this.inputControls.guestInformation.get('guestDetails')?.value
        ? this.inputControls.guestInformation.get('guestDetails')?.value
        : undefined,
      source: source || undefined,
      sourceName:
        (source &&
          source === 'OTA' &&
          this.reservationInfoControls.otaSourceName?.value) ||
        (source &&
          source === 'AGENT' &&
          this.reservationInfoControls.agentSourceName?.value) ||
        (source &&
          source === 'COMPANY' &&
          this.reservationInfoControls.companySourceName?.value) ||
        this.reservationInfoControls?.sourceName?.value ||
        undefined,
    };

    return data;
  }

  listenForSlotChanges() {
    //to update checkout time in reservation Summary
    this.reservationInfoControls.slotId.valueChanges
      .pipe(debounceTime(300))
      .subscribe((res) => {
        if (res) {
          const selectedSlot = this.bookingSlotList?.find(
            (item) => item?.value === res
          );
          const newCheckoutDate =
            this.reservationInfoControls?.from?.value +
            selectedSlot?.duration * 1000;

          newCheckoutDate &&
            this.reservationInfoControls?.to?.patchValue(newCheckoutDate);
        }
      });
  }

  listenForSessionTypeChanges() {
    this.reservationInfoControls.sessionType.valueChanges.subscribe(
      (sessionType) => {
        if (sessionType === SessionType.DAY_BOOKING) {
          this.handleDayBooking();
          this.getSlotListByRoomTypeId();
        } else {
          this.handleNightBooking();
        }
      }
    );
  }

  handleDayBooking() {
    // this.reservationInfoControls.to.patchValue(null);
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

  // Get total room, adult and child count for all room types
  updateBookingItemsCounts(bookingItems: BookingItemsSummary[]) {
    const totalValues = bookingItems.reduce(
      (acc, bookingItem) => {
        acc.adultCount += bookingItem.maxAdult;
        acc.childCount += bookingItem.maxChildren;
        acc.roomCount += bookingItem.roomCount;
        return acc;
      },
      { adultCount: 0, childCount: 0, roomCount: 0 } // Initial values for reduce
    );
    this.occupancyDetails = totalValues;
    // set occupancy details to display in summary.
  }

  resetFormData() {
    this.summaryData = new SummaryData().deserialize();
    this.occupancyDetails = {
      adultCount: 0,
      childCount: 0,
      roomCount: 0,
    };
    this.inputControls.offerId.reset();
    this.offersList.records = [];
  }

  handleEmailInvoice() {
    this.$subscription.add(
      this.manageReservationService
        .emailInvoice(this.reservationId, {})
        .subscribe((_) => {
          this.snackbarService.openSnackBarAsText(
            'Email Sent Successfully',
            '',
            {
              panelClass: 'success',
            }
          );
        })
    );
  }

  /**
   * @function ngOnDestroy to unsubscribe subscription.
   */
  ngOnDestroy(): void {
    this.isDataInitialized = false;
    this.$subscription.unsubscribe();
  }

  get roomControls() {
    return ((this.userForm.get('roomInformation') as FormGroup).get(
      'roomTypes'
    ) as FormArray).controls;
  }

  get roomInfoControls() {
    return this.userForm.get('roomInformation') as FormGroup;
  }

  get isPrePatchedRoomType() {
    return !this.reservationId;
  }
  get isDayBookingAvailable(): boolean {
    return this.configService.$isDayBookingAvailable.value;
  }
}
