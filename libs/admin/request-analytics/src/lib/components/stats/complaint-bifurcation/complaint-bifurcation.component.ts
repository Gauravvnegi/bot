import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CircularChart } from '@hospitality-bot/admin/shared';
import { chartConfig } from '../../../constant/chart';
import { TranslateService } from '@ngx-translate/core';
import { StatCard } from '../../../types/complaint.type';
import { statCard } from '../../../constant/stats';

@Component({
  selector: 'complaint-bifurcation',
  templateUrl: './complaint-bifurcation.component.html',
  styleUrls: ['./complaint-bifurcation.component.scss'],
})
export class ComplaintBifurcationComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private _translateService: TranslateService
  ) {}

  bifurcationFG: FormGroup;
  statCard = statCard;
  stats: any = {
    feedbacks: this.statCard,
    label: 'Response Received',
    totalCount: 0,
  };

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

  noActionCount = 0;
  gtmCount = 0;
  othersCount = 0;

  ngOnInit(): void {
    this.initFG();
  }

  initFG(): void {
    this.bifurcationFG = this.fb.group({
      bifurcation: ['ALL'],
    });
  }

  listenForGlobalFilter(): void {}

  getAllStats(): void {}

  getFocusedStats(): void {
    this.statCard = [];
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
    this.feedback.map((data) => {
      this.chart.labels.push(data.label);
      this.chart.data[0].push(data.score);
      this.chart.colors[0].backgroundColor.push(data.color);
      this.chart.colors[0].borderColor.push(data.color);
    });
  }
}
