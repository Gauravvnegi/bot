import { Component, Input, OnInit } from '@angular/core';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { SnackBarService } from 'libs/shared/material/src';
import { Subscription } from 'rxjs';
import {
  IMessageOverallAnalytics,
  MessageOverallAnalytics,
} from '../../data-models/statistics.model';
import { StatisticsService } from '../../services/statistics.service';

@Component({
  selector: 'hospitality-bot-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  $subscription = new Subscription();
  @Input() hotelId;
  messageOverallAnalytics: IMessageOverallAnalytics;
  constructor(
    private statisticsService: StatisticsService,
    private snackbarService: SnackBarService,
    private adminutilityService: AdminUtilityService
  ) {}

  ngOnInit(): void {
    this.getConversationStats();
  }

  getConversationStats() {
    const config = {
      queryObj: this.adminutilityService.makeQueryParams([
        {
          templateContext: 'TEMPLATE',
        },
      ]),
    };
    this.$subscription.add(
      this.statisticsService
        .getConversationStats(this.hotelId, config)
        .subscribe(
          (response) => {
            this.messageOverallAnalytics = new MessageOverallAnalytics().deserialize(
              response.messageCounts,
              { comparison: false }
            );
          },
          ({ error }) => this.snackbarService.openSnackBarAsText(error.message)
        )
    );
  }
}
