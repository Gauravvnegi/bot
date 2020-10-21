import { Component, OnInit, ViewChild } from '@angular/core';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';
import { SnackBarService } from 'libs/shared/material/src';
import { TemplateLoaderService } from 'libs/web-user/shared/src/lib/services/template-loader.service';
import { forkJoin, of } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReservationDetails } from 'libs/web-user/shared/src/lib/data-models/reservationDetails';
import { FeedbackDetailsService } from 'libs/web-user/shared/src/lib/services/feedback-details.service';

@Component({
  selector: 'hospitality-bot-feedback-main',
  templateUrl: './feedback-main.component.html',
  styleUrls: ['./feedback-main.component.scss']
})
export class FeedbackMainComponent implements OnInit {

  paymentStatusData;
  isReservationData = false;
  parentForm: FormGroup;
  reservationDetails: ReservationDetails;

  feedBackConfig;

  @ViewChild('saveButton') saveButton;
  constructor(
    private _reservationService: ReservationService,
    private _hotelService: HotelService,
    private _templateLoadingService: TemplateLoaderService,
    private fb: FormBuilder,
    private _feedbackDetailsService: FeedbackDetailsService,
    private _snackBarService: SnackBarService,
  ) { }

  ngOnInit(): void {
    this.getReservationDetails();
    this.getFeedBackConfig();
    this.parentForm = this.fb.group({});
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
      this.reservationDetails = reservationData;
      this._reservationService.reservationData = reservationData;
      this._templateLoadingService.isTemplateLoading$.next(false);
    });
  }

  initFeedbackConfigDS() {
    this._feedbackDetailsService.initFeedbackConfigDS(this.feedBackConfig);
  }

  addFGEvent(data) {
    this.parentForm.addControl(data.name, data.value);
  }

  getFeedBackConfig() {
    this._feedbackDetailsService.getFeedback().subscribe((response) => {
      this.feedBackConfig = response;
      this.initFeedbackConfigDS();
    });
  }

  private performActionIfNotValid(status: any[]) {
    this._snackBarService.openSnackBarAsText(status[0]['msg']);
    return;
  }

}
