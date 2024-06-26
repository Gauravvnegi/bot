import { Component } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RoutesConfigService } from '@hospitality-bot/admin/core/theme';
import {
  HotelDetailService,
  NavRouteOptions,
} from '@hospitality-bot/admin/shared';
import { IteratorField } from 'libs/admin/shared/src/lib/types/fields.type';
import { Subject, Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { ReservationForm } from '../../../../manage-reservation/src/lib/constants/form';
import { JourneyState } from '../../../../manage-reservation/src/lib/constants/reservation';
import { ReservationType } from '../../../../manage-reservation/src/lib/constants/reservation-table';
import { manageReservationRoutes } from '../../../../manage-reservation/src/lib/constants/routes';
import {
  OfferData,
  OfferList,
  ReservationCurrentStatus,
  SummaryData,
} from '../../../../manage-reservation/src/lib/models/reservations.model';
import { FormService } from '../../../../manage-reservation/src/lib/services/form.service';

@Component({
  selector: 'hospitality-bot-outlet-base',
  template: '',
})
export class BaseReservationComponent {
  userForm: FormGroup;
  fields: IteratorField[];

  entityId: string;
  reservationId: string;
  totalPaidAmount = 0;

  summaryData: SummaryData;
  formValueChanges: boolean = false;
  disabledForm = false;
  disableBtn = false;

  pageTitle: string;
  routes: NavRouteOptions = [];
  globalQueries = [];

  offersList: OfferList;
  selectedOffer: OfferData;

  $subscription = new Subscription();
  cancelRequests$ = new Subject<void>();
  isExternalBooking = false;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected hotelDetailService: HotelDetailService,
    protected formService: FormService,
    protected routesConfigService: RoutesConfigService
  ) {
    this.formService.resetData();
    this.reservationId = this.activatedRoute.snapshot.paramMap.get('id');
    const { navRoutes, title } = manageReservationRoutes[
      this.reservationId ? 'editReservation' : 'addReservation'
    ];
    this.routes = navRoutes;
    this.pageTitle = title;
    this.summaryData = new SummaryData().deserialize();
    this.initNavRoutes();
  }

  initNavRoutes() {
    this.$subscription.add(
      this.routesConfigService.navRoutesChanges
        .pipe(
          filter((navRoutesRes) => navRoutesRes.length > 0),
          take(1)
        )
        .subscribe((navRoutesRes) => {
          this.routes = [...navRoutesRes, ...this.routes];
        })
    );
  }

  setFormDisability(
    journeyState?: JourneyState,
    status?: ReservationCurrentStatus
  ): void {
    // this.userForm.get('reservationInformation.source').disable();
    if (this.reservationId) {
      const disableForm = () => {
        this.userForm.disable({ emitEvent: false });
        this.formService.disableBtn = true;
        this.disableBtn = true;
      };
      this.reservationInfoControls.sessionType.disable();
      const reservationType = this.reservationInfoControls.reservationType;
      switch (true) {
        case status === ReservationCurrentStatus.CHECKEDOUT ||
          reservationType.value === ReservationType.CANCELED:
          disableForm();
          this.disabledForm = true;
          break;
        case this.isExternalBooking && journeyState !== JourneyState.COMPLETED:
          this.disabledForm = true;
          disableForm();
          const roomTypeArray = ((this.inputControls
            .roomInformation as FormGroup).get('roomTypes') as FormArray)
            .controls;
          ['roomNumber'].forEach((controlName) =>
            roomTypeArray[0].get(controlName).enable({ emitEvent: false })
          );
          reservationType.enable();
          break;
        case journeyState === JourneyState.COMPLETED ||
          status === ReservationCurrentStatus.INHOUSE ||
          status === ReservationCurrentStatus.DUEOUT:
          disableForm();
          break;
        case journeyState !== JourneyState.COMPLETED:
          if (reservationType.value === ReservationType.CONFIRMED) {
            this.formService.disableBtn = true;
            this.disableBtn = true;
            this.inputControls.guestInformation
              .get('guestDetails')
              .disable({ emitEvent: false });
            const roomTypeArray = ((this.inputControls
              .roomInformation as FormGroup).get('roomTypes') as FormArray)
              .controls;
            roomTypeArray[0].disable({ emitEvent: false });

            // Enable the controls you don't want to disable
            [
              'roomNumbers',
              'roomNumber',
              'adultCount',
              'childCount',
            ].forEach((controlName) =>
              roomTypeArray[0].get(controlName).enable({ emitEvent: false })
            );
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

            this.inputControls.guestInformation
              .get('guestDetails')
              .enable({ emitEvent: false });
          }
          break;
      }
      for (const controlName in this.paymentControls) {
        if (
          controlName !== 'cashierFirstName' &&
          controlName !== 'cashierLastName'
        ) {
          this.paymentControls[controlName].enable({ emitEvent: false });
        }
      }
    }
  }

  updatePaymentData() {
    if (this.totalPaidAmount) {
      this.summaryData.totalPaidAmount = this.totalPaidAmount;
    }
    // Set value and validators for payment according to the summaryData.
    this.paymentControls?.totalPaidAmount.setValidators([Validators.min(0)]);
    this.paymentRuleControls?.amountToPay.setValidators([
      Validators.max(this.summaryData?.totalAmount),
      Validators.min(0),
    ]);
    this.paymentControls.totalPaidAmount.updateValueAndValidity();
    this.formService.deductedAmount.next(this.summaryData?.totalAmount);
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
    return (this.userForm.get('paymentMethod') as FormGroup)
      ?.controls as Record<
      keyof ReservationForm['paymentMethod'],
      AbstractControl
    >;
  }

  get paymentRuleControls() {
    return (this.userForm.get('paymentRule') as FormGroup)?.controls as Record<
      keyof ReservationForm['paymentRule'],
      AbstractControl
    >;
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
