import { Component, OnInit, Input } from '@angular/core';
import { FormArray } from '@angular/forms';
import { ReservationDetails } from 'libs/web-user/shared/src/lib/data-models/reservationDetails';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { ParentFormService } from 'libs/web-user/shared/src/lib/services/parentForm.service';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';
import { SnackBarService } from 'libs/shared/material/src';
import { TemplateLoaderService } from 'libs/web-user/shared/src/lib/services/template-loader.service';
import { forkJoin, of } from 'rxjs';
import { PaymentDetailsService } from 'libs/web-user/shared/src/lib/services/payment-details.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'hospitality-bot-payment-main',
  templateUrl: './payment-main.component.html',
  styleUrls: ['./payment-main.component.scss'],
})
export class PaymentMainComponent implements OnInit {
  paymentStatusData;
  paymentLabel;
  paymentNote;
  paymentImage;
  back: string;
  next: string;
  showBackButton: boolean;
  showSummaryButton: boolean;
  showButton: boolean = true;
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
    private route: ActivatedRoute
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
      this._templateLoadingService.isTemplateLoading$.next(false);
      this.reservationData = reservationData;
      this._reservationService.reservationData = reservationData;
      this.setPaymentStatus();
    });
  }

  private setPaymentStatus() {
    this._paymentDetailService
      .getPaymentStatus(this._reservationService.reservationId)
      .subscribe((response) => {
        this.paymentLabel =
          response.status === 'SUCCESS'
            ? 'Your Payment is completed successfully'
            : 'Your Payment is Failed';

        this.paymentImage =
          response.status === 'SUCCESS'
            ? 'assets/payment_success.png'
            : 'assets/payment_fail.png';

        this.paymentNote =
          response.status === 'SUCCESS'
            ? 'A confirmation email has been sent to '
            : 'An Error ocurred while processing your payment';
        let { title } = this._hotelService.getCurrentJourneyConfig();
        this.showSummaryButton = true;
        this.showBackButton = true;
        this.back = `Back To ${title}`;
        // this.buttonLabel = response.status === 'SUCCESS' ? title === 'CheckIn' ? 'View Summary' : this.button.showSummaryButton = false : `Return To ${title}`;
        
        let redirectUrl = window.location.href.substring(
          0,
          window.location.href.lastIndexOf('&')
        );
        this.paymentStatusData = {
          data: response,
          backRedirectUrl: redirectUrl + '&index=1',
          nextRedirectUrl: redirectUrl,
        };
        if (response.status === "SUCCESS") {
          this.next = 'View Summary';
          this.showBackButton = false;
        } else {
          this.next = 'Retry Payment';
        }
        if (title === 'Pre CheckIn' && response.status === 'SUCCESS') {
          this._snackBarService.openSnackBarAsText(
            'Pre-Checkin Sucessfull.',
            '',
            { panelClass: 'success' }
          );
        }
      }, (err) => this._snackBarService.openSnackBarAsText(err));
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
      this.router.navigateByUrl(`/summary?token=${this.route.snapshot.queryParamMap.get('token')}&entity=summary`);
    }
  }
}
