import { Component, Input } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { IteratorField } from 'libs/admin/shared/src/lib/types/fields.type';
import {
  OfferData,
  OfferList,
  SummaryData,
} from '../models/reservations.model';
import { SelectedEntity } from '../types/reservation.type';
import { EntitySubType, NavRouteOptions } from '@hospitality-bot/admin/shared';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { manageReservationRoutes } from '../constants/routes';
import { ReservationForm } from '../constants/form';
import { ReservationType } from '../constants/reservation-table';

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

  @Input() selectedEntity: SelectedEntity;

  $subscription = new Subscription();

  constructor(
    protected globalFilterService: GlobalFilterService,
    protected activatedRoute: ActivatedRoute
  ) {
    this.reservationId = this.activatedRoute.snapshot.paramMap.get('id');
    this.entityId = this.globalFilterService.entityId;
    const { navRoutes, title } = manageReservationRoutes[
      this.reservationId ? 'editReservation' : 'addReservation'
    ];
    this.routes = navRoutes;
    this.pageTitle = title;
    this.summaryData = new SummaryData().deserialize();
  }

  setFormDisability(): void {
    // this.userForm.get('reservationInformation.source').disable();
    if (this.reservationId) {
      const reservationType =
        this.bookingType === EntitySubType.ROOM_TYPE
          ? this.reservationInfoControls.reservationType
          : this.reservationInfoControls.status;
      switch (true) {
        case reservationType.value === ReservationType.CONFIRMED:
          this.userForm.disable();
          this.disabledForm = true;
          break;
        case reservationType.value === ReservationType.CANCELED:
          this.userForm.disable();
          this.disabledForm = true;
          break;
      }
      this.paymentControls.currency.enable();
      this.paymentControls.totalPaidAmount.enable();
      this.paymentControls.transactionId.enable();
      this.paymentControls.paymentRemark.enable();
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

  /**
   * @function ngOnDestroy to unsubscribe subscription.
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
