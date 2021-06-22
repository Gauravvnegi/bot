import { Component, OnInit } from '@angular/core';
import { SummaryDetails } from 'libs/web-user/shared/src/lib/data-models/summaryConfig.model';
import { ApplicationStatusComponent } from '../application-status/application-status.component';

@Component({
  selector: 'hospitality-bot-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'],
})
export class StatusComponent extends ApplicationStatusComponent
  implements OnInit {
  ngOnInit(): void {
    this.getSummaryDetails();
  }

  getSummaryDetails() {
    this.$subscription.add(
      this._summaryService
        .getSummaryStatus(this._reservationService.reservationId)
        .subscribe((res) => {
          this.summaryDetails = new SummaryDetails().deserialize(res);
          this.isLoaderVisible = false;
        })
    );
  }
}
