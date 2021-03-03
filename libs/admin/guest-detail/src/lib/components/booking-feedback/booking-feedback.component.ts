import { Component, OnInit, Input } from '@angular/core';
import { FeedbackService } from 'libs/admin/shared/src/lib/services/feedback.service';
import { BookingFeedback, Service } from '../../../../../guests/src/lib/data-models/feedback.model';
import { FeedBackDetail } from '../../../../../guests/src/lib/data-models/feedbackDetailsConfig.model';
import { SnackBarService } from 'libs/shared/material/src';
import { GuestDetailService } from '../../services/guest-detail.service';
import { MatDialogConfig } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DetailsComponent as ReservationDetailComponent } from 'libs/admin/reservation/src/lib/components/details/details.component';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';
@Component({
  selector: 'hospitality-bot-booking-feedback',
  templateUrl: './booking-feedback.component.html',
  styleUrls: ['./booking-feedback.component.scss']
})
export class BookingFeedbackComponent implements OnInit {

  private $subscription = new Subscription();
  @Input() title;
  @Input() rowData;
  @Input() feedbackConfig: FeedBackDetail;
  @Input() openedState: boolean;

  feedbackData;
  services: Service[];
  showMore: boolean = true;
  constructor(
    private feedbackService: FeedbackService,
    private guestDetailService: GuestDetailService,
    private _snackbarService: SnackBarService,
    private _modal: ModalService
  ) { }

  ngOnInit(): void {
    if (this.openedState) {
      this.loadFeedbackData(this.rowData.booking.bookingId);
    }
  }

  loadFeedbackData(reservationId) {
    if (!this.feedbackData) {
      // this.guestDetailService.getReservationFeedback('09335387-1fd6-484d-a5b5-91a7c823d2d0')
      this.guestDetailService.getReservationFeedback(reservationId)
        .subscribe((response) => {
          if (response) {
            this.feedbackData = new BookingFeedback().deserialize(response, this.feedbackConfig.ratingScaleConfig);
            this.setFeedbackData(new BookingFeedback().deserialize(response, this.feedbackConfig.ratingScaleConfig));
          }
        }, ({ error }) => {
          this._snackbarService.openSnackBarAsText(error.message);
        });
    }
  }

  openDetailPage(event, bookingId, tabKey?) {
    event.stopPropagation();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '100%';
    const detailCompRef = this._modal.openDialog(
      ReservationDetailComponent,
      dialogConfig
    );

    detailCompRef.componentInstance.bookingId = bookingId;
    tabKey && (detailCompRef.componentInstance.tabKey = tabKey);

    this.$subscription.add(
      detailCompRef.componentInstance.onDetailsClose.subscribe((res) => {
        detailCompRef.close();
      })
    );
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
