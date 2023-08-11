import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  BookingInfo,
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
import { BookingItemsSummary } from '../../types/response.type';
import { BaseReservationComponent } from '../base-reservation.component';

@Component({
  selector: 'hospitality-bot-add-reservation',
  templateUrl: './add-reservation.component.html',
  styleUrls: ['./add-reservation.component.scss', '../reservation.styles.scss'],
})
export class AddReservationComponent extends BaseReservationComponent
  implements OnInit, OnDestroy {
  roomTypeValues = [];
  reservationTypes: Option[] = [];
  roomNumbers: Option[] = [];
  roomTypeIds: string[] = [];
  expandAccordion = false;

  // Booking Summary props
  occupancyDetails: OccupancyDetails = {
    adultCount: 0,
    childCount: 0,
    roomCount: 0,
  };

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
    this.getReservationId();
  }

  initDetails() {
    this.expandAccordion = this.formService.enableAccordion;
    if (this.expandAccordion) {
      this.formService.enableAccordion = false;
    }
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
        sourceName: ['', [Validators.required, Validators.maxLength(60)]],
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
          this.userForm.get('offerId').reset();
          this.getOfferByRoomType(roomTypeIds);
          this.getSummaryData();
        }

        // When all items are removed from roomArray
        if (res[res.length - 1].roomTypeId === null) {
          this.summaryData = new SummaryData().deserialize();
        }
      });
  }

  getReservationId(): void {
    if (this.reservationId) {
      this.reservationTypes = [
        ...roomReservationTypes,
        { label: 'Canceled', value: 'CANCELED' },
        { label: 'No Show', value: 'NOSHOW' },
      ];
      this.getReservationDetails();
    } else {
      this.reservationTypes = roomReservationTypes;
    }
  }

  getReservationDetails(): void {
    this.$subscription.add(
      this.manageReservationService
        .getReservationDataById(this.reservationId, this.entityId)
        .subscribe(
          (response) => {
            const data = new ReservationFormData().deserialize(response);
            const { guestInformation, roomInformation, ...formData } = data;
            this.roomTypeValues = roomInformation;
            this.formService.guestInformation.next(guestInformation);

            this.userForm.patchValue(data);

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

  setFormDisability(): void {
    // this.userForm.get('reservationInformation.source').disable();
    const reservationType = this.reservationInfoControls.reservationType.value;
    const source = this.reservationInfoControls.source;
    source.disable();
    switch (true) {
      case reservationType === 'CONFIRMED':
        this.userForm.disable();
        this.disabledForm = true;
        break;
      case reservationType === 'CANCELED':
        this.userForm.disable();
        this.disabledForm = true;
        break;
      case source.value === 'CREATE_WITH':
        this.disabledForm = true;
        break;
      case source.value === 'OTHERS':
        this.disabledForm = true;
        break;
    }
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
      params: this.adminUtilityService.makeQueryParams([{ type: 'ROOM_TYPE' }]),
    };
    const data: ReservationSummary = {
      fromDate: this.reservationInfoControls.from.value,
      toDate: this.reservationInfoControls.to.value,
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
      offer: {
        id: this.inputControls.offerId.value,
      },
    };
    this.$subscription.add(
      this.manageReservationService
        .getSummaryData(this.entityId, data, config)
        .subscribe(
          (res) => {
            this.summaryData = new SummaryData()?.deserialize(res);
            this.updateBookingItemsCounts(this.summaryData.bookingItems);
            this.userForm
              .get('roomInformation')
              .patchValue(this.summaryData, { emitEvent: false });
            this.userForm
              .get('paymentMethod.totalPaidAmount')
              .setValidators([Validators.max(this.summaryData?.totalAmount)]);
            this.userForm
              .get('paymentMethod.totalPaidAmount')
              .updateValueAndValidity();
            this.userForm
              .get('paymentRule.deductedAmount')
              .patchValue(this.summaryData?.totalAmount);
            this.deductedAmount = this.summaryData?.totalAmount;
          },
          (error) => {}
        )
    );
  }

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
}
