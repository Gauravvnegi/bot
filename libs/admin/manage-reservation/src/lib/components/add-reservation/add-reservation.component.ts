import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
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
  Option,
} from '@hospitality-bot/admin/shared';
import { roomFields, roomReservationTypes } from '../../constants/reservation';
import { FormService } from '../../services/form.service';
import { debounceTime } from 'rxjs/operators';
import { OccupancyDetails, ReservationSummary } from '../../types/forms.types';
import {
  BookingItemsSummary,
  RoomReservationResponse,
} from '../../types/response.type';
import { BaseReservationComponent } from '../base-reservation.component';
import { ReservationType } from '../../constants/reservation-table';
import { convertToTitleCase } from 'libs/admin/shared/src/lib/utils/valueFormatter';

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
  totalPaidAmount = 0;

  constructor(
    private fb: FormBuilder,
    private adminUtilityService: AdminUtilityService,
    protected globalFilterService: GlobalFilterService,
    private manageReservationService: ManageReservationService,
    protected activatedRoute: ActivatedRoute,
    private formService: FormService
  ) {
    super(globalFilterService, activatedRoute);
  }

  ngOnInit(): void {
    this.initForm();
    this.initDetails();
    if (this.reservationId) this.getReservationDetails();
    this.initFormData();
  }

  initDetails() {
    this.expandAccordion = this.formService.enableAccordion;

    // Expand accordion for assign room from reservation table.
    if (this.expandAccordion) {
      this.formService.enableAccordion = false;
    }

    this.reservationTypes = roomReservationTypes;
    this.fields = roomFields;
    this.bookingType = EntitySubType.ROOM_TYPE;
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
        sourceName: [''],
        marketSegment: ['', Validators.required],
      }),
      offerId: [''],
    });
  }

  /**
   * @function listenForFormChanges Listen for form values changes.
   */
  listenForFormChanges(): void {
    this.formValueChanges = true;
    this.inputControls.roomInformation
      .get('roomTypes')
      .valueChanges.pipe(debounceTime(1000))
      .subscribe((res) => {
        const roomTypeIds = res.map((item) => item.roomTypeId);
        // check if the last added room type is selected
        if (res && res[res.length - 1].roomTypeId?.length) {
          this.getOfferByRoomType(roomTypeIds);
          this.getSummaryData();
        }

        // Reset summary when all items are removed from roomArray.
        if (res[res.length - 1].roomTypeId === null) {
          this.summaryData = new SummaryData().deserialize();
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
        .pipe(debounceTime(500))
        .subscribe((res) => {
          if (res) {
            const { roomInformation, ...formData } = res;
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
        .getReservationDataById(this.reservationId, this.entityId)
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

            this.formService.sourceData.next({
              source: source,
              sourceName: sourceName,
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
            this.formService.guestInformation.next(guestInformation);

            this.userForm.patchValue({
              reservationInformation: reservationInfo,
              formData,
            });

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
    if (roomTypeIds.length)
      this.$subscription.add(
        this.manageReservationService
          .getOfferByRoomType(this.entityId, config)
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
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        { type: EntitySubType.ROOM_TYPE },
      ]),
    };

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
      })),
      offerId: this.inputControls.offerId.value,
      guestId: this.inputControls.guestInformation.get('guestDetails')?.value,
    };

    this.$subscription.add(
      this.manageReservationService
        .getSummaryData(this.entityId, data, config)
        .subscribe(
          (res) => {
            this.summaryData = new SummaryData()?.deserialize(res);
            if (this.totalPaidAmount) {
              this.summaryData.totalPaidAmount = this.totalPaidAmount;
            }

            // Modify data to show summary for occupancy details.
            this.updateBookingItemsCounts(this.summaryData.bookingItems);

            // Set value and validators for payment according to the summaryData.
            this.userForm
              .get('paymentMethod.totalPaidAmount')
              .setValidators([Validators.max(this.summaryData?.totalAmount)]);
            this.userForm
              .get('paymentMethod.totalPaidAmount')
              .updateValueAndValidity();

            // Needs to be changed according to api.
            this.userForm
              .get('paymentRule.deductedAmount')
              .patchValue(this.summaryData?.totalAmount);
            this.deductedAmount = this.summaryData?.totalAmount;

            if (this.formValueChanges) {
              this.setFormDisability();
              this.formValueChanges = false;
            }
          },
          (error) => {}
        )
    );
  }

  // Get room adult and child count for all room types
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
