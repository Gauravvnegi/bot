import { Component, OnInit, Input } from '@angular/core';
import { FeedbackService } from 'libs/admin/shared/src/lib/services/feedback.service';
import { GuestTableService } from '../../services/guest-table.service';

@Component({
  selector: 'hospitality-bot-booking-feedback',
  templateUrl: './booking-feedback.component.html',
  styleUrls: ['./booking-feedback.component.scss']
})
export class BookingFeedbackComponent implements OnInit {

  @Input() title;
  @Input() rowData;
  feedbackData;
  constructor(
    private feedbackService: FeedbackService,
    private guestTableService: GuestTableService,
  ) { }

  ngOnInit(): void {
    console.log(this.rowData)
  }

  loadFeedbackData(reservationId) {
    if (!this.feedbackData) {
      this.guestTableService.getReservationFeedback('22040354-3e4c-4429-8676-591cd5c29ad7')
        .subscribe((response) => {
          this.feedbackData = response;
        }, ({ error }) => {
          console.log(error.message);
        });
    }
  }

}
