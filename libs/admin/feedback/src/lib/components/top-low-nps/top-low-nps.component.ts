import { Component, OnInit } from '@angular/core';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';
import { Subscription } from 'rxjs';
import { PerformanceNPS } from '../../data-models/statistics.model';
import { StatisticsService } from '../../services/statistics.service';

@Component({
  selector: 'hospitality-bot-top-low-nps',
  templateUrl: './top-low-nps.component.html',
  styleUrls: ['./top-low-nps.component.scss'],
})
export class TopLowNpsComponent implements OnInit {
  globalQueries;
  performanceNPS: PerformanceNPS;
  private $subscription = new Subscription();
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
        this.getPerformanceNps();
      })
    );
  }

  progressItems = [];

  tabFilterItems = [
    {
      label: 'Department',
      icon: '',
      value: 'DEPARTMENT',
      total: 0,
      isSelected: true,
    },
    {
      label: 'Service',
      icon: '',
      value: 'SERVICE',
      total: 0,
      isSelected: false,
    },
    {
      label: 'Touchpoint',
      icon: '',
      value: 'TOUCHPOINT',
      total: 0,
      isSelected: false,
    },
  ];

  tabFilterIdx: number = 0;

  getPerformanceNps(): void {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        {
          order: 'DESC',
          npsFilter: this.tabFilterItems[this.tabFilterIdx].value,
        },
      ]),
    };
    this.statisticsService.getNPSPerformance(config).subscribe(
      (response) => {
        this.performanceNPS = new PerformanceNPS().deserialize(response);
        // this.initData();
      },
      ({ error }) => {
        this._snackbarService.openSnackBarAsText(error.message);
      }
    );
  }

  onSelectedTabFilterChange($event) {
    this.tabFilterIdx = $event.index;
    this.getPerformanceNps();
  }
}
