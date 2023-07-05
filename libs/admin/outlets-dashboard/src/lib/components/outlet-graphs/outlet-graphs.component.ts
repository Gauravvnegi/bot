import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { NavRouteOptions, AdminUtilityService } from '@hospitality-bot/admin/shared';
import { DateService } from '@hospitality-bot/shared/utils';
import { BaseChartDirective } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { chartConfig } from '../../constants/graph';
import { stats, lineData, barData } from '../../constants/stats';

@Component({
  selector: 'hospitality-bot-outlet-graphs',
  templateUrl: './outlet-graphs.component.html',
  styleUrls: ['./outlet-graphs.component.scss']
})
export class OutletGraphsComponent implements OnInit {

  welcomeMessage = 'Welcome to your dashboard';
  navRoutes: NavRouteOptions = [{ label: 'Outlet Dashboard', link: './' }];

  @ViewChild(BaseChartDirective) baseChart: BaseChartDirective;

  selectedInterval: string;
  hotelId: string;
  globalQueries = [];
  $subscription = new Subscription();

  sellsStat;
  visitorsStat;
  usersStat;
  ordersStat;

  sellsGraph = {
    labels: [],
    data: chartConfig.barChart.data.datasets,
    type: 'bar',
    options: chartConfig.barChart.options,
    legend: false,
  };

  visitorsGraph = {
    labels: [],
    data: chartConfig.lineChart.data.datasets,
    type: 'line',
    options: chartConfig.lineChart.options,
    colors: chartConfig.lineChart.colors,
    legend: false,
  };

  usersGraph = {
    labels: [],
    data: chartConfig.lineChart.data.datasets,
    type: 'line',
    options: chartConfig.lineChart.options,
    colors: chartConfig.lineChart.colors,
    legend: false,
  };

  ordersGraph = {
    labels: [],
    data: chartConfig.barChart.data.datasets,
    type: 'bar',
    options: chartConfig.barChart.options,
    legend: false,
  };

  constructor(
    private globalFilterService: GlobalFilterService,
    private _adminUtilityService: AdminUtilityService,
    private _dateService: DateService
  ) {}

  ngOnInit(): void {
    this.listenForGlobalFilter();
  }

  listenForGlobalFilter(): void {
    this.hotelId = this.globalFilterService.hotelId;
    this.globalFilterService.globalFilter$.subscribe((data) => {
      const calenderType = {
        calenderType: this._dateService.getCalendarType(
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
      this.getStats();
    });
  }

  getStats() {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        ...this.globalQueries,
      ]),
    };
    this.sellsStat = stats.sellsGraph;
    this.visitorsStat = stats.totalVisitors;
    this.usersStat = stats.newUsers;
    this.ordersStat = stats.totalOrders;

    // this.$subscription.add(
    //   this.roomService.getStats(this.hotelId, config).subscribe((res)=>{
    //     console.log(res);
    //     this.sellsStat = new SellsGraph().deserialize(res.averageRoomRateGraph);
    //     this.visitorsStat = new VisitorsGraph().deserialize(res.occupancyStat);
    //     this.usersStat = new UsersGraph().deserialize(res.occupancyStat);
    //     this.ordersStat = new OrdersGraph().deserialize(res.averageRoomRateGraph);
    //   })
    // )

    const lineGraphData = lineData;
    const barGraphData = barData
    this.setBarGraph(barData);
    this.setLineGraph(lineData);
  }

  setBarGraph(graphData) {
    const graphArray = Object.entries(graphData).map(
      ([label, value]) => ({
        label,
        value,
      })
    );

    const labels = graphArray.map((data)=>
      this._dateService.convertTimestampToLabels(
        this.selectedInterval,
        data.label,
        this.globalFilterService.timezone,
        this._adminUtilityService.getDateFormatFromInterval(
          this.selectedInterval
        ),
        this.selectedInterval === 'week'
          ? this._adminUtilityService.getToDate(this.globalQueries)
          : null
      )    
    );
    const data = graphArray.map((data)=> data.value);
    this.sellsGraph.data[0].data = data;
    this.sellsGraph.labels = labels;
    this.ordersGraph.data[0].data = data;
    this.ordersGraph.labels = labels;

  }

  setLineGraph(graphData) {
    const timestamps = Object.keys(graphData);
    this.usersGraph.data[0].data = [];
    this.usersGraph.labels = [];
    this.visitorsGraph.data[0].data=[];
    this.visitorsGraph.labels=[];
    timestamps.forEach((timestamp, i) => {
      const data = this._dateService.convertTimestampToLabels(
        this.selectedInterval,
        timestamp,
        this.globalFilterService.timezone,
        this._adminUtilityService.getDateFormatFromInterval(
          this.selectedInterval
        ),
        this.selectedInterval === 'week'
          ? this._adminUtilityService.getToDate(this.globalQueries)
          : null
      )
      this.usersGraph.labels.push(data);
      this.visitorsGraph.labels.push(data);
      this.usersGraph.data[0].data.push(graphData[timestamp]);
      this.visitorsGraph.data[0].data.push(graphData[timestamp]);
    });
  }

}
