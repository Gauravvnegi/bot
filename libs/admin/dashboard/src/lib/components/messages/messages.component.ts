import { Component, Input, OnInit } from '@angular/core';
import { SubscriptionPlanService } from 'apps/admin/src/app/core/theme/src/lib/services/subscription-plan.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { SnackBarService } from 'libs/shared/material/src';
import { Subscription } from 'rxjs';
import {
  CommunicationChannels,
  config,
  IMessageOverallAnalytics,
  MessageOverallAnalytics,
} from '../../data-models/statistics.model';
import { StatisticsService } from '../../services/statistics.service';

@Component({
  selector: 'hospitality-bot-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit {
  config = config;
  data = [
    { today: 59, yesterday: 31, comparisonPercent: 47, label: 'Sent' },
    { today: 57, yesterday: 31, comparisonPercent: 46, label: 'Delivered' },
    { today: 41, yesterday: 22, comparisonPercent: 46, label: 'Read' },
    { today: 3, yesterday: 0, comparisonPercent: 100, label: 'Failed' },
  ];
  total = 59;
  $subscription = new Subscription();
  @Input() hotelId;
  messageOverallAnalytics: IMessageOverallAnalytics;
  channels;
  constructor(
    private statisticsService: StatisticsService,
    private snackbarService: SnackBarService,
    private subscriptionPlanService: SubscriptionPlanService,
    private adminutilityService: AdminUtilityService
  ) {}

  ngOnInit(): void {
    this.getConversationStats();
    this.listenForChannels();
  }

  progressValue(data) {
    return Math.floor((data.today / this.total) * 100);
  }

  getConversationStats() {
    const config = {
      queryObj: this.adminutilityService.makeQueryParams([
        {
          templateContext: 'TEXT',
          comparison: true,
        },
      ]),
    };
    this.$subscription.add(
      this.statisticsService
        .getConversationStats(this.hotelId, config)
        .subscribe(
          (response) => {
            this.messageOverallAnalytics = new MessageOverallAnalytics().deserialize(
              response.messageCounts
            );
          },
          ({ error }) => this.snackbarService.openSnackBarAsText(error.message)
        )
    );
  }

  listenForChannels() {
    this.subscriptionPlanService.subscription$.subscribe((res) => {
      if (res['features'])
        this.channels = new CommunicationChannels()
          .deserialize(res['features'].CHANNELS)
          .channels.filter((channel) => channel.active);
    });
  }
}
