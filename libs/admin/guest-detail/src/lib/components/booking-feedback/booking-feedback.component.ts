import { Component, OnInit, Input } from '@angular/core';
import { FeedbackService } from 'libs/admin/shared/src/lib/services/feedback.service';
import {
  BookingFeedback,
  Service,
} from '../../../../../guests/src/lib/data-models/feedback.model';
import { FeedBackDetail } from '../../../../../guests/src/lib/data-models/feedbackDetailsConfig.model';
import { SnackBarService } from 'libs/shared/material/src';
import { GuestDetailService } from '../../services/guest-detail.service';
import { MatDialogConfig } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DetailsComponent as ReservationDetailComponent } from 'libs/admin/reservation/src/lib/components/details/details.component';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
@Component({
  selector: 'hospitality-bot-booking-feedback',
  templateUrl: './booking-feedback.component.html',
  styleUrls: ['./booking-feedback.component.scss'],
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
    public _globalFilterService: GlobalFilterService,
    private guestDetailService: GuestDetailService,
    private _snackbarService: SnackBarService,
    private _modal: ModalService
  ) {}

  ngOnInit(): void {}

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
