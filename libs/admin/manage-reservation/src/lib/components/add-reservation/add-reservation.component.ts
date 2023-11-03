import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  OfferData,
  OfferList,
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
  roomFields,
  roomReservationTypes,
} from '../../constants/reservation';
import { FormService } from '../../services/form.service';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { OccupancyDetails, ReservationSummary } from '../../types/forms.types';
import {
  BookingItemsSummary,
  RoomReservationResponse,
} from '../../types/response.type';
import { BaseReservationComponent } from '../base-reservation.component';
import { ReservationType } from '../../constants/reservation-table';
import { convertToTitleCase } from 'libs/admin/shared/src/lib/utils/valueFormatter';
import { Subject } from 'rxjs';
import { RoutesConfigService } from '@hospitality-bot/admin/core/theme';
import { QuickReservationForm } from 'libs/admin/dashboard/src/lib/data-models/reservation.model';

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
  }

  ngOnInit(): void {
    this.initForm();
    this.initDetails();
    if (this.reservationId) this.getReservationDetails();
    this.initFormData();
    this.listenRouteData();
  }

  initDetails() {
    this.listenFormServiceChanges();
    this.reservationTypes = roomReservationTypes;
    this.fields = roomFields;
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

  initParamsData(paramsData: QuickReservationForm) {
    const {
      roomInformation,
      guestInformation,
      reservationInformation: { source, sourceName, ...reservationInfo },
      ...data
    } = paramsData;
    this.userForm.patchValue({
      reservationInformation: reservationInfo,
      ...data,
    });
    this.formService.sourceData.next({
      source: source,
      sourceName: sourceName,
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
    this.userForm = this.fb.group({
      reservationInformation: this.fb.group({
        from: ['', Validators.required],
        to: ['', Validators.required],
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

        const roomTypeIds = res.map((item) => item.roomTypeId);
        // check if the last added room type is selected
        if (res && res[res.length - 1].roomTypeId?.length) {
          this.getOfferByRoomType(roomTypeIds);
          this.getSummaryData();
        }

        // Reset form data when all items are removed from roomArray.
        if (res[res.length - 1].roomTypeId === null) {
          this.resetFormData();
        }
      });

    // Listen changes in reservation Type.
    this.reservationInfoControls.reservationType.valueChanges.subscribe(
      (res) => {
        // Disable roomNumber field if the reservation type is draft.
        if (res === ReservationType.DRAFT) {
          this.roomControls.forEach((item) => {
            item.get('roomNumbers').patchValue([], { emitEvent: false });
          });
          this.fields[3].disabled = true;
        } else {
          this.fields[3].disabled = false;
        }
      }
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
            this.formService.sourceData.next({
              source: formData.reservationInformation.source,
              sourceName: formData.reservationInformation.sourceName,
            });
            // check if room type was patched
            if (roomInformation.roomTypes[0].roomTypeId.length)
              this.roomTypeValues = roomInformation.roomTypes;
            this.userForm.patchValue(formData);
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
            const data = new ReservationFormData().deserialize(response);
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
            } = data;
            this.checkinJourneyState = data.journeyState;
            this.isExternalBooking = response.externalBooking;
            this.formService.sourceData.next({
              source: source,
              sourceName: sourceName,
              agent: response?.agent ?? null,
            });
            this.isDraftBooking = reservationInfo.reservationType === 'DRAFT';
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
              formData,
            });

            this.inputControls.offerId.patchValue(data.offerId);
            if (data.offerId) {
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
      this.userForm.patchValue({ offerId: offerData.id });
      this.getSummaryData();
    } else {
      this.userForm.get('offerId').reset();
      this.getSummaryData();
    }
    this.selectedOffer = offerData;
  }

  getSummaryData(): void {
    this.cancelRequests$.next();
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
            // Modify data to show summary for occupancy details.
            this.updateBookingItemsCounts(this.summaryData.bookingItems);
            this.updatePaymentData();

            if (this.formValueChanges) {
              this.reservationId
                ? this.setFormDisability(this.checkinJourneyState)
                : this.setFormDisability;
              this.formValueChanges = false;
            }
          },
          (error) => {}
        )
    );
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
      guestId: this.inputControls.guestInformation.get('guestDetails')?.value,
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
