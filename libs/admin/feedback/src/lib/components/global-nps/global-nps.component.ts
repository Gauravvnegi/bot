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

  chart: any = {
    Labels: ['Neutral', 'Positive', 'Negative'],
    Data: [[5, 45, 50]],
    Type: 'doughnut',

    Legend: false,
    Colors: [
      {
        backgroundColor: ['#4BA0F5', '#1AB99F', '#EF1D45'],
        borderColor: ['#4BA0F5', '#1AB99F', '#EF1D45'],
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
    this.getGlobalNps();
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
      })
    );
  }

  getGlobalNps(): void {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams(this.globalQueries),
    };
    this.statisticsService.getGlobalNPS(config).subscribe((response) => {
      this.globalNps = new GlobalNPS().deserialize(response);

      this.chart.Data[0].length = 0;
      this.chart.Data[0] = [
        this.globalNps.neutral,
        this.globalNps.positive,
        this.globalNps.negative,
      ];
    });
  }
}
