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
  EntitySubType,
  HotelDetailService,
  Option,
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
import { RoutesConfigService } from '@hospitality-bot/admin/core/theme';
import { ReservationForm } from '../../constants/form';

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
  currentStatus: ReservationCurrentStatus;
  reservationFormData: ReservationFormData;

  constructor(
    private fb: FormBuilder,
    private adminUtilityService: AdminUtilityService,
    private manageReservationService: ManageReservationService,
    protected activatedRoute: ActivatedRoute,
    protected formService: FormService,
    protected hotelDetailService: HotelDetailService,
    protected routesConfigService: RoutesConfigService
  ) {
    super(activatedRoute, hotelDetailService, formService, routesConfigService);
    this.initForm();
  }

  ngOnInit(): void {
    this.initDetails();
    if (this.reservationId) this.getReservationDetails();
    this.initFormData();
    this.listenRouteData();
  }

  initDetails() {
    this.listenFormServiceChanges();
    this.reservationTypes = roomReservationTypes;
    this.bookingType = EntitySubType.ROOM_TYPE;
  }

  listenRouteData() {
    this.activatedRoute.queryParams
      .pipe(debounceTime(100))
      .subscribe((queryParams) => {
        if (queryParams.data) {
          const data = queryParams.data;
          const paramsData = JSON.parse(atob(data));
          this.initParamsData(paramsData);
        }
      });
  }

  initParamsData(paramsData: ReservationForm) {
    const {
      roomInformation,
      guestInformation,
      reservationInformation: { source, sourceName, ...reservationInfo },
      ...data
    } = paramsData;
    this.userForm.patchValue(
      {
        reservationInformation: reservationInfo,
        ...data,
      },
      { emitEvent: false }
    );
    this.formService.sourceData.next({
      source: source,
      sourceName: sourceName,
      agent: data?.agent ?? null,
      marketSegment: reservationInfo?.marketSegment,
    });
    this.reservationInfoControls.reservationType.patchValue(
      ReservationType.CONFIRMED
    );
    this.roomTypeValues = [roomInformation];
    this.formService.guestInformation.next(guestInformation.guestDetails);
  }

  listenFormServiceChanges() {
    this.expandAccordion = this.formService.enableAccordion;
    // Expand accordion for assign room from reservation table.
    if (this.expandAccordion) {
      this.formService.enableAccordion = false;
    }
    this.formService.getSummary.subscribe((res) => {
      if (this.roomInfoControls.valid) this.getSummaryData();
    });
  }

  /**
   * @function initForm Initialize form
   */
  initForm(): void {
    let toDate = new Date();
    toDate.setDate(toDate.getDate() + 1);
    this.userForm = this.fb.group({
      reservationInformation: this.fb.group({
        from: [new Date(), Validators.required],
        to: [toDate, Validators.required],
        reservationType: ['', Validators.required],
        source: ['', Validators.required],
        sourceName: ['', [Validators.required, Validators.maxLength(60)]],
        otaSourceName: [''],
        agentSourceName: [''],
        marketSegment: ['', Validators.required],
      }),
      offerId: [''],
      instructions: this.fb.group({
        specialInstructions: [''],
      }),
    });
  }

  /**
   * @function listenForFormChanges Listen for form values changes.
   */
  listenForFormChanges(): void {
    this.formValueChanges = true;
    this.inputControls.roomInformation
      .get('roomTypes')
      .valueChanges.pipe(debounceTime(300))
      .subscribe((res) => {
        const data = this.inputControls.roomInformation.get(
          'roomTypes'
        ) as FormGroup;
        res = data.getRawValue();
        // Get raw value to get disabled control values as well

        // check if the last added room type is selected
        if (res && res[res.length - 1].roomTypeId?.length) {
          this.getSummaryData();
        }

        // Reset form data when all items are removed from roomArray.
        if (res[res.length - 1].roomTypeId === null) {
          this.resetFormData();
        }
      });
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
            this.formService.sourceData.next({
              source: formData.reservationInformation.source,
              sourceName: formData.reservationInformation.sourceName,
              agent: formData?.agent ?? null,
              marketSegment: formData?.reservationInformation?.marketSegment,
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
    this.$subscription.add(
      this.manageReservationService
        .getReservationDataById(this.reservationId, this.selectedEntity.id)
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

            this.isDraftBooking =
              reservationInfo.reservationType === ReservationType.DRAFT;
            this.formService.currentJourneyStatus.next(response.status);
            this.currentStatus = response?.status;
            this.isCheckedout =
              response.status === ReservationCurrentStatus.CHECKEDOUT;
            this.checkinJourneyState = this.reservationFormData.journeyState;
            this.isExternalBooking = response.externalBooking;
            this.formService.sourceData.next({
              source: source,
              sourceName: sourceName,
              agent: response?.agent ?? null,
              marketSegment: reservationInfo?.marketSegment,
            });
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
            this.formService.guestInformation.next(guestInformation.id);

            this.userForm.patchValue({
              reservationInformation: reservationInfo,
              instructions: formData.instructions,
              paymentRule: formData.paymentRule,
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
          (error) => {}
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
        },
      ]),
    };
    // get offers for all roomTypes
    this.cancelOfferRequests$.next();

    if (roomTypeIds.length) {
      this.$subscription.add(
        this.manageReservationService
          .getOfferByRoomType(this.selectedEntity.id, config)
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
    const configData = this.getFormData();
    let isAdultAndRoomCount = configData.bookingItems.every((item) => {
      return item.occupancyDetails.maxAdult && item.roomDetails.roomCount;
    });

    if (isAdultAndRoomCount && (!this.reservationId || configData.guestId)) {
      this.$subscription.add(
        this.manageReservationService
          .getSummaryData(this.selectedEntity.id, this.getFormData(), {
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
            (error) => {}
          )
      );
      const roomTypeIds = configData.bookingItems.map(
        (item) => item.roomDetails.roomTypeId
      );
      // check if the last added room type is selected
      this.getOfferByRoomType(roomTypeIds);
    }
  }

  getFormData() {
    // Summary data for booking summary
    const data: ReservationSummary = {
      from: this.reservationInfoControls.from.value,
      to: this.reservationInfoControls.to.value,
      bookingItems: this.roomControls.map((item) => ({
        roomDetails: {
          ratePlan: {
            id: item.get('ratePlan').value,
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
        : null,
      guestId: this.inputControls.guestInformation.get('guestDetails')?.value
        ? this.inputControls.guestInformation.get('guestDetails')?.value
        : null,
    };

    return data;
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

  /**
   * @function ngOnDestroy to unsubscribe subscription.
   */
  ngOnDestroy(): void {
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
}
