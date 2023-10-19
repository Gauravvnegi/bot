import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { Subscription } from 'rxjs';
import { RoomService } from '../../services/room.service';
import { Chart } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { AdminUtilityService, NavRouteOptions } from 'libs/admin/shared/src';
import {
  OccupancyGraph,
  RemainingInventory,
  RemainingInventoryCost,
  RoomStatGraph,
} from '../../models/rooms-data-table.model';
import { DateService } from '@hospitality-bot/shared/utils';
import { chartConfig } from '../../constant/chart';

@Component({
  selector: 'hospitality-bot-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit {
  constructor(
    private globalFilterService: GlobalFilterService,
    private roomService: RoomService,
    private _adminUtilityService: AdminUtilityService,
    private _dateService: DateService
  ) {}

  roomStat: RoomStatGraph;
  occupancyStat: OccupancyGraph;
  remainingInventory: RemainingInventory;
  remainingCost: RemainingInventoryCost;

  @ViewChild(BaseChartDirective) baseChart: BaseChartDirective;

  selectedInterval: string;
  id: string;
  dataValue: number[];
  labels: string[];
  globalQueries = [];

  remainingInventoryStat: RemainingInventory;
  remainingCostStat: RemainingInventoryCost;

  remainingInventoryChart = {
    labels: chartConfig.doughnutChart.data.labels,
    data: chartConfig.doughnutChart.data.datasets[0].data,
    type: chartConfig.doughnutChart.type,
    options: chartConfig.doughnutChart.options,
    colors: chartConfig.doughnutChart.colors,
  };

  remainingCostChart = {
    labels: chartConfig.doughnutChart.data.labels,
    data: chartConfig.doughnutChart.data.datasets[0].data,
    type: chartConfig.doughnutChart.type,
    options: chartConfig.doughnutChart.options,
    colors: chartConfig.doughnutChart.colors,
  };

  occupancyGraph = {
    data: chartConfig.occupancyStat.data.datasets,
    labels: [],
    options: chartConfig.occupancyStat.options,
    colors: chartConfig.occupancyStat.colors,
    legend: false,
    type: 'line',
  };

  averageRoomRateGraph = {
    data: chartConfig.averageRoomStat.data.datasets,
    labels: [],
    options: chartConfig.averageRoomStat.options,
    type: 'bar',
    legend: false,
  };

  welcomeMessage = 'Welcome To Room Dashboard';
  navRoutes: NavRouteOptions = [{ label: 'Room Dashboard', link: './' }];
  entityId: string;
  $subscription = new Subscription();
  chart: any;

  ngOnInit(): void {
    this.listenForGlobalFilter();
  }

  listenForGlobalFilter(): void {
    this.entityId = this.globalFilterService.entityId;
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

  getStats(): void {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        ...this.globalQueries,
      ]),
    };
    this.$subscription.add(
      this.roomService.getStats(this.entityId, config).subscribe((res) => {
        this.roomStat = new RoomStatGraph().deserialize(
          res.averageRoomRateStat
        );
        this.occupancyStat = new OccupancyGraph().deserialize(
          res.occupancyStat
        );
        this.remainingInventory = new RemainingInventory().deserialize(
          res.inventoryRemainingStat
        );
        this.remainingCost = new RemainingInventoryCost().deserialize(
          res.remainingInventoryCostStat
        );

        this.remainingInventoryStat = new RemainingInventory();
        this.remainingInventoryStat.label = 'InventoryRemaining';
        this.remainingInventoryStat.additionalData = this.remainingInventory.additionalData;

        this.remainingCostStat = new RemainingInventoryCost();
        this.remainingCostStat.label = 'RemainingInventoryCost';
        this.remainingCostStat.additionalData = this.remainingCost.additionalData;

        this.setAvgRoomRateGraphConfig();
        this.setOccupancyGraphConfig();

        this.setRemainingInventoryConfig(
          [this.remainingInventory.occupied, this.remainingInventory.remaining],
          ['Occupied', 'Remaining']
        );
        this.setRemainingCostConfig(
          [this.remainingCost.spent, this.remainingCost.remaining],
          ['Spent', 'Remaining']
        );
      })
    );
  }

  setRemainingInventoryConfig(dataValue: number[], labels: string[]) {
    this.remainingInventoryChart.labels = [...labels];
    this.remainingInventoryChart.data = [dataValue];
  }

  setRemainingCostConfig(dataValue: number[], labels: string[]) {
    this.remainingCostChart.labels = [...labels];
    this.remainingCostChart.data = [dataValue];
  }

  setOccupancyGraphConfig() {
    const timestamps = Object.keys(this.occupancyStat.graph);
    this.occupancyGraph.data[0].data = [];
    this.occupancyGraph.labels = [];
    timestamps.forEach((timestamp, i) => {
      this.occupancyGraph.labels.push(
        this._dateService.convertTimestampToLabels(
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
      );
      this.occupancyGraph.data[0].data.push(
        this.occupancyStat.graph[timestamp]
      );
    });
  }

  setAvgRoomRateGraphConfig() {
    const graphArray = Object.entries(this.roomStat.graph).map(
      ([label, value]) => ({
        label,
        value,
      })
    );
    const labels = graphArray.map((data) =>
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
    const data = graphArray.map((data) => data.value);
    this.averageRoomRateGraph.data[0].data = data;
    this.averageRoomRateGraph.labels = labels;
  }

  /**
   * @function ngOnDestroy to unsubscribe subscription
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }

  format(value) {
    return AdminUtilityService.valueFormatter(value, 2);
  }
}
