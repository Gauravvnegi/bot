import { Component, OnDestroy, OnInit } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { AdminUtilityService } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { DateService } from '@hospitality-bot/shared/utils';
import { ChartOptions, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { chartConfig } from '../../constants/chart';
import { MessageExchanged } from '../../data-models/subscription.model';
import { SubscriptionService } from '../../services/subscription.service';

@Component({
  selector: 'hospitality-bot-messages-exchanged',
  templateUrl: './messages-exchanged.component.html',
  styleUrls: ['./messages-exchanged.component.scss'],
})
export class MessagesExchangedComponent implements OnInit, OnDestroy {
  public barChartOptions: ChartOptions = {
    responsive: true,
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
  };
  public barChartLabels: Label[] = [];
  public barChartType = chartConfig.type.bar;
  public barChartLegend = false;

  public barChartData: ChartDataSets[] = [
    { data: [], label: 'Messages Exchanged' },
  ];
  public barChartColors: Color[] = [{ backgroundColor: '#4ba0f5' }];
  $subscription = new Subscription();
  globalQueries = [];
  selectedInterval: string;
  hotelId: string;
  graphData: MessageExchanged;
  constructor(
    private globalFilterService: GlobalFilterService,
    private _adminUtilityService: AdminUtilityService,
    private dateService: DateService,
    private subscriptionService: SubscriptionService,
    private snackbarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.registerListeners();
  }

  registerListeners(): void {
    this.listenForGlobalFilters();
  }

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
        const calenderType = {
          calenderType: this.dateService.getCalendarType(
            data['dateRange'].queryValue[0].toDate,
            data['dateRange'].queryValue[1].fromDate,
            this.globalFilterService.timezone
          ),
        };
        this.selectedInterval = calenderType.calenderType;
        this.globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
          calenderType,
        ];
        this.hotelId = this.globalFilterService.hotelId;
        this.getChartData();
      })
    );
  }

  getChartData() {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        { entityIds: this.hotelId },
      ]),
    };
    this.$subscription.add(
      this.subscriptionService.getMessagesExchangedStats(config).subscribe(
        (resposne) => {
          this.graphData = new MessageExchanged().deserialize(resposne);
          this.initGraphData();
        }
      )
    );
  }

  /**
   * @function initGraphData To initialize the graph data.
   */
  protected initGraphData(): void {
    this.barChartData[0].data = [];
    this.barChartLabels = [];
    this.graphData.messageGraph.forEach((d, i) => {
      this.barChartLabels.push(
        this.dateService.convertTimestampToLabels(
          this.selectedInterval,
          d.label,
          this.globalFilterService.timezone,
          this.getFormatForlabels(),
          this.selectedInterval === 'week'
            ? this._adminUtilityService.getToDate(this.globalQueries)
            : null
        )
      );
      this.barChartData[0].data.push(d.value);
    });
  }

  getFormatForlabels() {
    if (this.selectedInterval === 'date') return 'DD MMM';
    else if (this.selectedInterval === 'month') return 'MMM YYYY';
    return '';
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
