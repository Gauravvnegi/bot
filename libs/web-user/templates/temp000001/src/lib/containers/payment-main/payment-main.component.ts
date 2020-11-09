import { Component, OnInit } from '@angular/core';
import { FormArray } from '@angular/forms';
import { ReservationDetails } from 'libs/web-user/shared/src/lib/data-models/reservationDetails';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { ParentFormService } from 'libs/web-user/shared/src/lib/services/parentForm.service';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';
import { SnackBarService } from 'libs/shared/material/src';
import { TemplateLoaderService } from 'libs/web-user/shared/src/lib/services/template-loader.service';
import { forkJoin, of } from 'rxjs';
import { PaymentDetailsService } from 'libs/web-user/shared/src/lib/services/payment-details.service';
import { Router } from '@angular/router';
import { PaymentMainStatus } from 'libs/web-user/shared/src/lib/data-models/PaymentStatusConfig.model';

@Component({
  selector: 'hospitality-bot-payment-main',
  templateUrl: './payment-main.component.html',
  styleUrls: ['./payment-main.component.scss'],
})

export class PaymentMainComponent implements OnInit {
  paymentStatusData:PaymentMainStatus = new PaymentMainStatus();
  
  ispaymentStatusLoaded: boolean = false;
  isReservationData = false;
  parentForm = new FormArray([]);
  reservationData: ReservationDetails;
  constructor(
    private _reservationService: ReservationService,
    private _parentFormService: ParentFormService,
    private _hotelService: HotelService,
    private _snackBarService: SnackBarService,
    private _templateLoadingService: TemplateLoaderService,
    private _paymentDetailService: PaymentDetailsService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getReservationDetails();
    this.registerListeners();
  }

  private getReservationDetails() {
    forkJoin(
      this._reservationService.getReservationDetails(
        this._reservationService.reservationId
      ),
      of(true)
    ).subscribe(([reservationData, val]) => {
      this._hotelService.hotelConfig = reservationData['hotel'];
      this.isReservationData = true;
      this.reservationData = reservationData;
      this._reservationService.reservationData = reservationData;
      this.setPaymentStatus();
    });
  }

  private setPaymentStatus() {
    this._paymentDetailService
      .getPaymentStatus(this._reservationService.reservationId)
      .subscribe((response) => {
        let status = response.status.toUpperCase();
        this._templateLoadingService.isTemplateLoading$.next(false);
        let redirectUrl = window.location.href.substring(
          0,
          window.location.href.lastIndexOf('&')
        );
        let { title } = this._hotelService.getCurrentJourneyConfig();
        this.paymentStatusData = new PaymentMainStatus().deserialize(response, redirectUrl, title, status);
        this.ispaymentStatusLoaded = true;
        if (this.reservationData['currentJourney'] === 'PRECHECKIN' && status === 'SUCCESS') {
          this._snackBarService.openSnackBarAsText(
            'Pre-Checkin Sucessfull.',
            '',
            { panelClass: 'success' }
          );
        }
      }, ({error}) => this._snackBarService.openSnackBarAsText(error.message));
  }

  private registerListeners() {
    this.parentForm.valueChanges.subscribe((val) => {
      this._parentFormService.parentFormValueAndValidity$.next({
        parentForm: this.parentForm,
      });
    });
  }

  redirect(redirectUrl?) {
    if (redirectUrl) {
      window.location.href = redirectUrl;
    } else {
      if (this.reservationData['currentJourney'] !== 'CHECKIN') {
        this.router.navigateByUrl(`/summary?token=${this.reservationData['redirectionParameter'].journey.token}&entity=summary`);
      } else {
        this.router.navigateByUrl(`/?token=${this.reservationData['redirectionParameter'].journey.token}`);
      }
    }
  }

  get status() {
    if (this.paymentStatusData && this.paymentStatusData.data) {
      return this.paymentStatusData.data.status.toUpperCase();
    }
    return null;
  }

  get data() {
    if (this.paymentStatusData) {
      return this.paymentStatusData.data;
    }
    return null;
  }
}
