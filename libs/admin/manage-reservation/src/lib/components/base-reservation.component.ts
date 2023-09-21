import { Component, Input } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
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
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
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

  summaryData: SummaryData;
  formValueChanges: boolean = false;
  disabledForm = false;
  deductedAmount = 0;

  pageTitle: string;
  routes: NavRouteOptions = [];
  globalQueries = [];

  offersList: OfferList;
  selectedOffer: OfferData;

  selectedEntity: SelectedEntity;

  $subscription = new Subscription();

  constructor(
    protected globalFilterService: GlobalFilterService,
    protected activatedRoute: ActivatedRoute,
    protected hotelDetailService: HotelDetailService,
    protected formService: FormService
  ) {
    this.reservationId = this.activatedRoute.snapshot.paramMap.get('id');
    this.entityId = this.globalFilterService.entityId;
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
          reservationType.value === ReservationType.CANCELED:
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
            ['roomNumbers', 'adultCount', 'childCount'].forEach((controlName) =>
              roomTypeArray[0].get(controlName).enable()
            );
          }
          break;
      }
      for (const controlName in this.paymentControls) {
        // if (paymentControls.hasOwnProperty(controlName)) {
        this.paymentControls[controlName].enable();
        // }
      }
      reservationType.enable();
    }
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
}
