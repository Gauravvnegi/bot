import { Component, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { AdminUtilityService } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { dashboard } from '../../../constants/dashboard';
import {
  IMessageOverallAnalytics,
  MessageOverallAnalytics,
} from '../../../data-models/statistics.model';
import { StatisticsService } from '../../../services/statistics.service';
import { SelectOption } from '../../../types/dashboard.type';

@Component({
  selector: 'hospitality-bot-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnChanges {
  $subscription = new Subscription();
  @Input() hotelId: string;
  @Input() channelOptions: SelectOption[];
  messageOverallAnalytics: IMessageOverallAnalytics;
  messagesFG: FormGroup;
  constructor(
    private statisticsService: StatisticsService,
    private _snackbarService: SnackBarService,
    private adminutilityService: AdminUtilityService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initFG();
  }

  /**
   * @function initFG Initializes the form group.
   */
  initFG(): void {
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
   * @function getConversationStats gets the messages stats for today from api.
   * @param queries The filter array list.
   */
  getConversationStats(queries): void {
    const config = {
      queryObj: this.adminutilityService.makeQueryParams(queries),
    };
    this.$subscription.add(
      this.statisticsService
        .getConversationStats(this.hotelId, config)
        .subscribe(
          (response) => {
            this.messageOverallAnalytics = new MessageOverallAnalytics().deserialize(
              response?.messageCounts
            );
          },
          ({ error }) =>
            this._snackbarService
              .openSnackBarWithTranslate(
                {
                  translateKey: 'messages.error.some_thing_wrong',
                  priorityMessage: error?.message,
                },
                ''
              )
              .subscribe()
        )
    );
  }

  /**
   * @function handleChannelChange Handles the channel dropdown value change.
   * @param event The material select change event.
   */
  handleChannelChange(event: MatSelectChange): void {
    this.getConversationStats([
      {
        templateContext: 'TEXT',
        comparison: true,
        channelType: event.value,
      },
    ]);
  }

  get dashboardConfig() {
    return dashboard;
  }
}
