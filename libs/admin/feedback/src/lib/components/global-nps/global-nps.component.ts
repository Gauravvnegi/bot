import { Component, OnInit } from '@angular/core';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { SnackBarService } from 'libs/shared/material/src';
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

  loading: boolean = false;

  private $subscription = new Subscription();
  globalQueries;

  constructor(
    private statisticsService: StatisticsService,
    private _globalFilterService: GlobalFilterService,
    private _adminUtilityService: AdminUtilityService,
    private _snackbarService: SnackBarService
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
        this.chart.Data[0].push(this.roundValue(data[key]));
        this.chart.Colors[0].backgroundColor.push(this.color[key]);
        this.chart.Colors[0].borderColor.push(this.color[key]);
      }
    });
  }

  getGlobalNps(): void {
    this.loading = true;
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams(this.globalQueries),
    };
    this.statisticsService.getGlobalNPS(config).subscribe(
      (response) => {
        this.loading = false;
        this.globalNps = new GlobalNPS().deserialize(response);
        this.initGraphData(this.globalNps);
      },
      ({ error }) => {
        this.loading = false;
        this._snackbarService.openSnackBarAsText(error.message);
      }
    );
  }

  roundValue(data) {
    return data % 1 >= 0.5 ? Math.ceil(data) : Math.floor(data);
  }
}
