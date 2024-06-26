import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { ReservationService } from '../../services/reservation.service';

@Component({
  selector: 'hospitality-bot-stay-feedback',
  templateUrl: './stay-feedback.component.html',
  styleUrls: ['./stay-feedback.component.scss', '../accordion-style.scss'],
})
export class StayFeedbackComponent implements OnInit, OnDestroy {
  @Input() rowData;
  @Input() openedState: boolean;
  private $subscription = new Subscription();
  constructor(
    public globalFilterService: GlobalFilterService,
    private snackbarService: SnackBarService,
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {}

  downloadFeedback(event, id) {
    event.stopPropagation();

    this.$subscription.add(
      this.reservationService.getFeedbackPdf(id).subscribe((response) => {
        const link = document.createElement('a');
        link.href = response.fileDownloadUri;
        link.target = '_blank';
        link.download = response.fileName;
        link.click();
        link.remove();
      })
    );
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
