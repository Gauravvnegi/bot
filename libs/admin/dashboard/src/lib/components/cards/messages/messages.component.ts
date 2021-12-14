import { Component, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { SnackBarService } from 'libs/shared/material/src';
import { Subscription } from 'rxjs';
import {
  IMessageOverallAnalytics,
  MessageOverallAnalytics,
} from '../../../data-models/statistics.model';
import { StatisticsService } from '../../../services/statistics.service';

@Component({
  selector: 'hospitality-bot-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnChanges {
  $subscription = new Subscription();
  @Input() hotelId;
  @Input() channelOptions;
  messageOverallAnalytics: IMessageOverallAnalytics;
  messagesFG: FormGroup;
  constructor(
    private statisticsService: StatisticsService,
    private snackbarService: SnackBarService,
    private adminutilityService: AdminUtilityService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.initFG();
  }

  /**
   * @function initFG Initializes the form group
   */
  initFG() {
    this.messagesFG = this.fb.group({
      channel: ['ALL'],
    });
  }

  ngOnChanges(): void {
    this.getConversationStats([
      {
        templateContext: 'TEXT',
        comparison: true,
        channelType: this.messagesFG?.get('channel')?.value || 'ALL',
      },
    ]);
  }

  /**
   * @function getConversationStats gets the messages stats for today from api
   * @param {Array} queries
   */
  getConversationStats(queries) {
    const config = {
      queryObj: this.adminutilityService.makeQueryParams(queries),
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

  /**
   * @function handleChannelChange Handles the channel dropdown value change
   * @param {MouseEvent} event
   */
  handleChannelChange(event) {
    this.getConversationStats([
      {
        templateContext: 'TEXT',
        comparison: true,
        channelType: event.value,
      },
    ]);
  }
}
