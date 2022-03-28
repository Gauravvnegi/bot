import { Component, OnInit } from '@angular/core';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { SnackBarService } from 'libs/shared/material/src';
import { Subscription } from 'rxjs';
import { Conversation } from '../../models/whatsapp-analytics.model';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'hospitality-bot-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss'],
})
export class ConversationComponent implements OnInit {
  $subscription = new Subscription();
  globalFilters;
  hotelId: string;
  chart: any = {
    Labels: ['No Data'],
    Data: [[100]],
    Type: 'doughnut',
    Legend: false,
    Colors: [
      {
        backgroundColor: ['#D5D1D1'],
        borderColor: ['#D5D1D1'],
      },
    ],
    Options: {
      responsive: true,
      cutoutPercentage: 0,
      tooltips: {
        backgroundColor: 'white',
        bodyFontColor: 'black',
        borderColor: '#f4f5f6',
        borderWidth: 3,
        titleFontColor: 'black',
        titleMarginBottom: 5,
        xPadding: 10,
        yPadding: 10,
      },
    },
  };
  stats: Conversation;
  constructor(
    private _adminUtilityService: AdminUtilityService,
    private _globalFilterService: GlobalFilterService,
    private analyticsService: AnalyticsService,
    private snackbarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.registerListeners();
  }

  registerListeners() {
    this.listenForGlobalFilters();
  }

  listenForGlobalFilters() {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        this.globalFilters = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ];
        this.getHotelId(this.globalFilters);
        this.getConversationData();
      })
    );
  }

  getConversationData() {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams(this.globalFilters),
    };

    this.$subscription.add(
      this.analyticsService
        .getConversationMessageStats(this.hotelId, config)
        .subscribe(
          (response) => {
            this.stats = new Conversation().deserialize(response);
            this.initGraphData(
              this.stats.statistics.reduce(
                (accumulator, current) => accumulator + current.count,
                0
              ) === 0
            );
          },
          ({ error }) => {
            this.snackbarService.openSnackBarAsText(error.message);
          }
        )
    );
  }

  getHotelId(globalQueries): void {
    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) {
        this.hotelId = element.hotelId;
      }
    });
  }

  initGraphData(defaultGraph = false) {
    if (defaultGraph) {
      this.chart.Labels = ['No Data'];
      this.chart.Data = [[100]];
      this.chart.Colors[0] = [
        {
          backgroundColor: ['#D5D1D1'],
          borderColor: ['#D5D1D1'],
        },
      ];
      return;
    }
    this.chart.Labels = [];
    this.chart.Data = [[]];
    this.chart.Colors[0].backgroundColor = [];
    this.chart.Colors[0].borderColor = [];

    this.stats.statistics.forEach((data) => {
      if (data.count) {
        this.chart.Labels.push(data.label);
        this.chart.Data[0].push(data.count);
        this.chart.Colors[0].backgroundColor.push(data.color);
        this.chart.Colors[0].borderColor.push(data.color);
      }
    });
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
