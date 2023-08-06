import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { Subscription } from 'rxjs';
import { manageReservationRoutes } from '../../constants/routes';
import {
  BookingInfo,
  OfferData,
  OfferList,
  ReservationFormData,
  RoomSummaryData,
} from '../../models/reservations.model';
import { ManageReservationService } from '../../services/manage-reservation.service';
import {
  AdminUtilityService,
  EntitySubType,
  NavRouteOptions,
  Option,
} from '@hospitality-bot/admin/shared';
import { ReservationForm, RoomTypes } from '../../constants/form';
import { roomFields, roomReservationTypes } from '../../constants/reservation';
import { FormService } from '../../services/form.service';
import { SelectedEntity } from '../../types/reservation.type';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ReservationSummary } from '../../types/forms.types';
import { BookingItemsSummary } from '../../types/response.type';
import { BaseReservationComponent } from '../base-reservation.component';
import { title } from '../../constants/reservation-table';

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

  summaryData: RoomSummaryData;

  expandAccordion = false;

  // Booking Summary props
  adultCount = 0;
  roomCount = 1;
  childCount = 0;

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
  listenForFormChanges(index?: number): void {
    this.formValueChanges = true;
    this.roomControls[index].valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((res) => {
        if (res) {
          this.userForm.get('offerId').reset();
          this.getOfferByRoomType(res);
          this.getSummaryData();
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
            debugger;
            this.roomTypeValues = roomInformation;
            this.formService.guestId.next(guestInformation.id);
            this.userForm.patchValue(data);
            // this.summaryData = new SummaryData().deserialize(response);
            this.setFormDisability(data.reservationInformation);
            if (data.offerId)
              this.getOfferByRoomType(
                this.roomControls[0].get('roomTypeId').value
              );
            // this.userForm.valueChanges.subscribe((_) => {
            // if (!this.formValueChanges) {
            // this.formValueChanges = true;
            // this.listenForFormChanges();
            // }
            // });
          },
          (error) => {}
        )
    );
  }

  setFormDisability(data: BookingInfo): void {
    this.userForm.get('reservationInformation.source').disable();
    switch (true) {
      case data.reservationType === 'CONFIRMED':
        this.userForm.disable();
        this.disabledForm = true;
        break;
      case data.reservationType === 'CANCELED':
        this.userForm.disable();
        this.disabledForm = true;
        break;
      case data.source === 'CREATE_WITH':
        this.disabledForm = true;
        break;
      case data.source === 'OTHERS':
        this.disabledForm = true;
        break;
    }
  }

  getOfferByRoomType(id: string): void {
    if (id)
      this.$subscription.add(
        this.manageReservationService
          .getOfferByRoomType(this.entityId, id)
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
    };
    this.$subscription.add(
      this.manageReservationService
        .getSummaryData(this.entityId, data, config)
        .subscribe(
          (res) => {
            this.summaryData = new RoomSummaryData()?.deserialize(res);
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
        acc.maxAdult += bookingItem.maxAdult;
        acc.maxChildren += bookingItem.maxChildren;
        acc.roomCount += bookingItem.roomCount;
        return acc;
      },
      { maxAdult: 0, maxChildren: 0, roomCount: 0 } // Initial values for reduce
    );
    this.adultCount = totalValues.maxAdult;
    this.roomCount = totalValues.roomCount;
    this.childCount = totalValues.maxChildren;
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
