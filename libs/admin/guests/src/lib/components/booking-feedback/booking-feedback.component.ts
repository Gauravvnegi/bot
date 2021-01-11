import { Component, OnInit, Input } from '@angular/core';
import { FeedbackService } from 'libs/admin/shared/src/lib/services/feedback.service';
import { GuestTableService } from '../../services/guest-table.service';
import { BookingFeedback } from '../../data-models/feedback.model';
import { FeedBackDetail } from '../../data-models/feedbackDetailsConfig.model';
import { SnackBarService } from 'libs/shared/material/src';

@Component({
  selector: 'hospitality-bot-booking-feedback',
  templateUrl: './booking-feedback.component.html',
  styleUrls: ['./booking-feedback.component.scss']
})
export class BookingFeedbackComponent implements OnInit {

  @Input() title;
  @Input() rowData;
  @Input() feedbackConfig: FeedBackDetail;

  feedbackData;
  services;
  showMore: boolean = true;
  constructor(
    private feedbackService: FeedbackService,
    private guestTableService: GuestTableService,
    private _snackbarService: SnackBarService
  ) { }

  ngOnInit(): void {}

  loadFeedbackData(reservationId) {
    if (!this.feedbackData) {
      this.guestTableService.getReservationFeedback('22040354-3e4c-4429-8676-591cd5c29ad7')
        .subscribe((response) => {
          this.feedbackData = new BookingFeedback().deserialize(response, this.feedbackConfig.ratingScaleConfig);
          this.setFeedbackData(new BookingFeedback().deserialize(response, this.feedbackConfig.ratingScaleConfig));
        }, ({ error }) => {
          this._snackbarService.openSnackBarAsText(error.message);
        });
    }
  }

  setFeedbackData(feedback: BookingFeedback) {
    this.services = [];
    feedback.departments.forEach((data) => {
      this.services = [...this.services, ...data.services];
    });
  }

  toggleShowMore() {
    this.showMore = !this.showMore;
  }

}
