import { Component, OnInit, Input } from '@angular/core';
import { TemplateLoaderService } from 'libs/web-user/shared/src/lib/services/template-loader.service';
import { ReservationDetails } from 'libs/web-user/shared/src/lib/data-models/reservationDetails';
import { FormArray } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { ParentFormService } from 'libs/web-user/shared/src/lib/services/parentForm.service';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';

@Component({
  selector: 'hospitality-bot-payment-status',
  templateUrl: './payment-status.component.html',
  styleUrls: ['./payment-status.component.scss']
})
export class PaymentStatusComponent implements OnInit {

  @Input() paymentStatusData;
  isReservationData = false;
  parentForm = new FormArray([]);
  reservationData: ReservationDetails;
  constructor(
    private _reservationService: ReservationService,
    private _parentFormService: ParentFormService,
    private _hotelService: HotelService,
    private _snackBarService: SnackBarService,
    private _templateLoadingService: TemplateLoaderService
  ) { }

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
      if (this.paymentStatusData.journey === 'PRECHECKIN') {
        this._snackBarService.openSnackBarAsText(
          'Pre-Checkin Sucessfull.',
          '',
          { panelClass: 'success' }
        );
      }
    });
  }

  private registerListeners() {
    this.parentForm.valueChanges.subscribe((val) => {
      this._parentFormService.parentFormValueAndValidity$.next({
        parentForm: this.parentForm,
      });
    });
  }

  redirect() {
    window.location.href = this.paymentStatusData.redirectUrl;
  }

}
