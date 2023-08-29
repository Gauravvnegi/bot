import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  AdminUtilityService,
  CircularChart,
} from '@hospitality-bot/admin/shared';
import { chartConfig } from '../../../constant/chart';
import { TranslateService } from '@ngx-translate/core';
import { StatCard } from '../../../types/complaint.type';
import { Subscription, forkJoin } from 'rxjs';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { DateService } from '@hospitality-bot/shared/utils';
import { AnalyticsService } from '../../../services/analytics.service';
import { RequestStats } from '../../../models/statistics.model';
import { RequestResponse } from '../../../types/response.types';

@Component({
  selector: 'complaint-bifurcation',
  templateUrl: './complaint-bifurcation.component.html',
  styleUrls: ['./complaint-bifurcation.component.scss'],
})
export class ComplaintBifurcationComponent implements OnInit {
  bifurcationFG: FormGroup;

  statCard: StatCard[] = [];
  request: StatCard[] = [];
  loading = false;

  selectedInterval: string;

  @Input() globalQueries = [];
  feedback: any = [];

  chart: CircularChart = {
    labels: [],
    data: [[]],
    type: chartConfig.type.doughnut,
    legend: false,
    colors: [
      {
        backgroundColor: [chartConfig.defaultColor],
        borderColor: [chartConfig.defaultColor],
      },
    ],
    options: chartConfig.options.feedback,
  };

  totalCount = 0;

  $subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private _translateService: TranslateService,
    private globalFilterService: GlobalFilterService,
    private dateService: DateService,
    private analyticsService: AnalyticsService,
    private adminUtilityService: AdminUtilityService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.globalQueries.currentValue.length) {
      this.getStats();
    }
  }

  ngOnInit(): void {
    this.initFG();
    // this.listenForGlobalFilters();
  }

  initFG(): void {
    this.bifurcationFG = this.fb.group({
      bifurcation: ['ALL'],
    });
  }

  getConfig(type: string) {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        { entityType: type },
      ]),
    };
    return config;
  }

  getStats(): void {
    this.loading = true;
    const focusedStats$ = this.analyticsService.getComplaintStats(
      this.getConfig('FOCUSED')
    );
    const allStats$ = this.analyticsService.getComplaintStats(
      this.getConfig('ALL')
    );

    this.$subscription.add(
      forkJoin([focusedStats$, allStats$]).subscribe(
        ([focusedResponse, allStatsRes]) => {
          this.getAllStats(allStatsRes);
          this.getFocusedStats(focusedResponse);
          this.initGraph(
            this.request.reduce(
              (accumulator, current) => accumulator + +current.score,
              0
            ) === 0
          );
          this.loading = false;
        }
      )
    );
  }

  getAllStats(data: RequestResponse): void {
    this.request = [];
    this.totalCount = 0;
    const chartData = new RequestStats()
      .deserialize(data)
      .requestStats.filter((stat) => stat.label !== 'Timed-out');
    chartData.forEach((stat) => {
      this.request.push({
        label: stat.label,
        score: stat.value,
        additionalData: stat.value.toString(),
        comparisonPercent: 100,
        color: stat.color,
      });
      this.totalCount += stat.value;
    });
  }

  getFocusedStats(data: RequestResponse): void {
    this.statCard = [];
    const statCardData = new RequestStats().deserialize(data);
    statCardData.requestStats.map((stat) => {
      this.statCard.push({
        label: stat.label,
        score: stat.value,
        additionalData: stat.value.toString(),
        comparisonPercent: 100,
        color: stat.color,
      });
    });
  }

  initGraph(defaultGraph = true): void {
    this.chart.labels = [];
    this.chart.data = [[]];
    this.chart.colors = [
      {
        backgroundColor: [],
        borderColor: [],
      },
    ];
    if (defaultGraph) {
      this._translateService
        .get('no_data_chart')
        .subscribe((message) => this.chart.labels.push(message));
      this.chart.data[0].push(100);
      this.chart.colors[0].backgroundColor.push(chartConfig.defaultColor);
      this.chart.colors[0].borderColor.push(chartConfig.defaultColor);
      return;
    }
    this.request.map((data) => {
      this.chart.labels.push(data.label);
      this.chart.data[0].push(+data.score);
      this.chart.colors[0].backgroundColor.push(data.color);
      this.chart.colors[0].borderColor.push(data.color);
    });
  }
}
