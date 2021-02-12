import { Component, OnInit } from '@angular/core';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { Subscription } from 'rxjs';
import { GlobalNPS } from '../../data-models/statistics.model';
import { StatisticsService } from '../../services/statistics.service';

@Component({
  selector: 'hospitality-bot-global-nps',
  templateUrl: './global-nps.component.html',
  styleUrls: ['./global-nps.component.scss'],
})
export class GlobalNpsComponent implements OnInit {
  globalNps: GlobalNPS;
  color = {
    neutral: '#4BA0F5',
    positive: '#1AB99F',
    negative: '#EF1D45',
  };

  labels = {
    neutral: 'Neutral',
    positive: 'Positive',
    negative: 'Negative',
  };

  defaultChart: any = {
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
    },
  };

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
    },
  };

  private $subscription = new Subscription();
  globalQueries;

  constructor(
    private statisticsService: StatisticsService,
    private _globalFilterService: GlobalFilterService,
    private _adminUtilityService: AdminUtilityService
  ) {}

  ngOnInit(): void {
    this.registerListeners();
  }

  registerListeners(): void {
    this.listenForGlobalFilters();
  }

  listenForGlobalFilters(): void {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        //set-global query everytime global filter changes
        this.globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ];
        this.getGlobalNps();
      })
    );
  }

  initGraphData(data) {
    this.chart.Data[0].length = this.chart.Labels.length = this.chart.Colors[0].backgroundColor.length = this.chart.Colors[0].borderColor.length = 0;
    Object.keys(data).forEach((key) => {
      if (key !== 'label' && key !== 'score' && data[key]) {
        this.chart.Labels.push(this.labels[key]);
        this.chart.Data[0].push(data[key]);
        this.chart.Colors[0].backgroundColor.push(this.color[key]);
        this.chart.Colors[0].borderColor.push(this.color[key]);
      }
    });
  }

  getGlobalNps(): void {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams(this.globalQueries),
    };
    this.statisticsService.getGlobalNPS(config).subscribe((response) => {
      this.globalNps = new GlobalNPS().deserialize(response);

      this.initGraphData(this.globalNps);
    });
  }
}
