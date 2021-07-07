import { Component, OnInit } from '@angular/core';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { Subscription } from 'rxjs';
import { IStat, MessageStat } from '../../models/whatsapp-analytics.model';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'hospitality-bot-whatsapp-message-analytics',
  templateUrl: './whatsapp-message-analytics.component.html',
  styleUrls: ['./whatsapp-message-analytics.component.scss'],
})
export class WhatsappMessageAnalyticsComponent implements OnInit {
  data = {
    messageCounts: {
      deliveredCount: {
        yesterday: 0,
        today: 0,
        comparisonPercentage: 0,
      },
      sentCount: {
        yesterday: 1,
        today: 2,
        comparisonPercentage: 100,
      },
      readCount: {
        yesterday: 0,
        today: 0,
        comparisonPercentage: 0,
      },
      failedCount: {
        yesterday: 0,
        today: 0,
        comparisonPercentage: 0,
      },
      data: null,
    },
  };
  responseData: IStat[];
  hotelId: string;
  $subscription = new Subscription();
  constructor(
    private _globalFilterService: GlobalFilterService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit(): void {
    this.listenForGlobalFilters();
    this.getConversationStats();
  }

  registerListeners(): void {
    this.listenForGlobalFilters();
  }

  listenForGlobalFilters(): void {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        this.getHotelId([
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
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

  getConversationStats() {
    // this.$subscription.add(
    //   this.analyticsService
    //     .getConversationStats(this.hotelId)
    //     .subscribe((response) => {
    //       this.responseData = new MessageStat().deserialize(response.messageCounts);
    //     })
    // );

    this.responseData = new MessageStat().deserialize(this.data.messageCounts);
  }
}
