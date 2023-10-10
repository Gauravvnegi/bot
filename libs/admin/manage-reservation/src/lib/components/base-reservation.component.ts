import { Component, Input } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormGroup,
  Validators,
} from '@angular/forms';
import { IteratorField } from 'libs/admin/shared/src/lib/types/fields.type';
import {
  OfferData,
  OfferList,
  SummaryData,
} from '../models/reservations.model';
import { SelectedEntity } from '../types/reservation.type';
import {
  EntitySubType,
  HotelDetailService,
  NavRouteOptions,
} from '@hospitality-bot/admin/shared';
import { Subject, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { manageReservationRoutes } from '../constants/routes';
import { ReservationForm } from '../constants/form';
import { JourneyState } from '../constants/reservation';
import { ReservationType } from '../constants/reservation-table';
import { FormService } from '../services/form.service';

@Component({
  selector: 'hospitality-bot-outlet-base',
  template: '',
})
export class BaseReservationComponent {
  userForm: FormGroup;
  fields: IteratorField[];

  entityId: string;
  outletId?: string;
  reservationId: string;
  bookingType: string;
  totalPaidAmount = 0;

  summaryData: SummaryData;
  formValueChanges: boolean = false;
  disabledForm = false;

  pageTitle: string;
  routes: NavRouteOptions = [];
  globalQueries = [];

  offersList: OfferList;
  selectedOffer: OfferData;

  selectedEntity: SelectedEntity;

  $subscription = new Subscription();
  cancelRequests$ = new Subject<void>();

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected hotelDetailService: HotelDetailService,
    protected formService: FormService
  ) {
    this.reservationId = this.activatedRoute.snapshot.paramMap.get('id');
    const { navRoutes, title } = manageReservationRoutes[
      this.reservationId ? 'editReservation' : 'addReservation'
    ];
    this.routes = navRoutes;
    this.pageTitle = title;
    this.summaryData = new SummaryData().deserialize();
    this.getSelectedEntity();
  }

  getSelectedEntity() {
    const outletId = this.activatedRoute.snapshot.queryParams.entityId;

    const properties = this.hotelDetailService.getPropertyList();
    const selectedOutlet = properties.filter((item) => item.value === outletId);

    this.selectedEntity = selectedOutlet[0];
  }

  setFormDisability(journeyState?: JourneyState): void {
    // this.userForm.get('reservationInformation.source').disable();
    if (this.reservationId) {
      const reservationType =
        this.bookingType === EntitySubType.ROOM_TYPE
          ? this.reservationInfoControls.reservationType
          : this.reservationInfoControls.status;
      switch (true) {
        case this.bookingType !== EntitySubType.ROOM_TYPE ||
          reservationType.value === ReservationType.CANCELED ||
          journeyState === JourneyState.COMPLETED:
          this.userForm.disable();
          this.disabledForm = true;
          this.formService.disableBtn = true;
          break;

        case journeyState !== JourneyState.COMPLETED:
          if (reservationType.value === ReservationType.CONFIRMED) {
            this.formService.disableBtn = true;
            this.inputControls.guestInformation.get('guestDetails').disable();
            const roomTypeArray = ((this.inputControls
              .roomInformation as FormGroup).get('roomTypes') as FormArray)
              .controls;
            roomTypeArray[0].disable();

            // Enable the controls you don't want to disable
            [
              'roomNumbers',
              'roomNumber',
              'adultCount',
              'childCount',
            ].forEach((controlName) =>
              roomTypeArray[0].get(controlName).enable()
            );
          }
          break;
      }
      for (const controlName in this.paymentControls) {
        if (
          controlName !== 'cashierFirstName' &&
          controlName !== 'cashierLastName'
        ) {
          this.paymentControls[controlName].enable();
        }
      }
      // reservationType.enable();
    }
  }

  updatePaymentData() {
    if (this.totalPaidAmount) {
      this.summaryData.totalPaidAmount = this.totalPaidAmount;
    }
    // Set value and validators for payment according to the summaryData.
    this.paymentControls.totalPaidAmount.setValidators([
      Validators.max(this.summaryData?.totalAmount),
      Validators.min(0),
    ]);
    this.paymentControls.totalPaidAmount.updateValueAndValidity();

    // Needs to be changed according to api.
    // this.paymentRuleControls.deductedAmount.patchValue(
    //   this.summaryData?.totalAmount
    // );
  }

  get reservationInfoControls() {
    return (this.userForm.get('reservationInformation') as FormGroup)
      .controls as Record<
      keyof ReservationForm['reservationInformation'],
      AbstractControl
    >;
  }

  get inputControls() {
    return this.userForm.controls as Record<
      keyof ReservationForm,
      AbstractControl
    >;
  }

  get paymentControls() {
    return (this.userForm.get('paymentMethod') as FormGroup).controls as Record<
      keyof ReservationForm['paymentMethod'],
      AbstractControl
    >;
  }

  // get paymentRuleControls() {
  //   return (this.userForm.get('paymentRule') as FormGroup).controls as Record<
  //     keyof ReservationForm['paymentRule'],
  //     AbstractControl
  //   >;
  // }
}
