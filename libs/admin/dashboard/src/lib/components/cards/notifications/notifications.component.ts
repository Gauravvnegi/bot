import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { SnackBarService } from 'libs/shared/material/src';
import { Subscription } from 'rxjs';
import {
  IMessageOverallAnalytics,
  MessageOverallAnalytics,
} from '../../../data-models/statistics.model';
import { StatisticsService } from '../../../services/statistics.service';

@Component({
  selector: 'hospitality-bot-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  $subscription = new Subscription();
  @Input() hotelId;
  @Input() channelOptions;
  messageOverallAnalytics: IMessageOverallAnalytics;
  globalQueries;
  messagesFG: FormGroup;
  constructor(
    private statisticsService: StatisticsService,
    private snackbarService: SnackBarService,
    private adminutilityService: AdminUtilityService,
    private _globalFilterService: GlobalFilterService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initFG();
    this.registerListeners();
  }

  initFG() {
    this.messagesFG = this.fb.group({
      channel: ['ALL'],
    });
  }

  registerListeners() {
    this.listenForGlobalFilters();
  }

  listenForGlobalFilters() {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        this.globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ];
        this.getHotelId([
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ]);
        this.getConversationStats([
          ...this.globalQueries,
          {
            templateContext: 'TEMPLATE',
            channelType: this.messagesFG?.get('channel')?.value,
          },
        ]);
      })
    );
  }

  getHotelId(globalQueries): void {
    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) {
        this.hotelId = element.hotelId;
      }
    });
  }

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
              response.messageCounts,
              { comparison: false }
            );
          },
          ({ error }) => this.snackbarService.openSnackBarAsText(error.message)
        )
    );
  }

  handleChannelChange(event) {
    this.getConversationStats([
      ...this.globalQueries,
      {
        templateContext: 'TEMPLATE',
        channelType: event.value,
      },
    ]);
  }
}
