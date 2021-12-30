import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
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
  selector: 'hospitality-bot-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  $subscription = new Subscription();
  @Input() hotelId: string;
  @Input() channelOptions: SelectOption[];
  messageOverallAnalytics: IMessageOverallAnalytics;
  globalQueries;
  messagesFG: FormGroup;
  constructor(
    private statisticsService: StatisticsService,
    private _snackbarService: SnackBarService,
    private adminutilityService: AdminUtilityService,
    private _globalFilterService: GlobalFilterService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initFG();
    this.registerListeners();
  }

  /**
   * @function initFG To initialize the form group.
   */
  initFG(): void {
    this.messagesFG = this.fb.group({
      channel: ['ALL'],
    });
  }

  registerListeners(): void {
    this.listenForGlobalFilters();
  }

  /**
   * @function listenForGlobalFilters To listen for the global filters change and after each change reloads the data.
   */
  listenForGlobalFilters(): void {
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
            channelType: this.messagesFG?.get('channel')?.value || 'ALL',
          },
        ]);
      })
    );
  }

  /**
   * @function getHotelId Gets the hotel id from the array of object.
   * @param globalQueries The global filter array list.
   */
  getHotelId(globalQueries): void {
    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) {
        this.hotelId = element.hotelId;
      }
    });
  }

  /**
   * @function getConversationStats Gets the notification stat for a date range.
   * @param queries The global filter array list.
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
              response?.messageCounts,
              { comparison: false }
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
      ...this.globalQueries,
      {
        templateContext: 'TEMPLATE',
        channelType: event.value,
      },
    ]);
  }

  get dashboardConfig() {
    return dashboard;
  }
}
