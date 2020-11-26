import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseChartDirective, Label, MultiDataSet } from 'ng2-charts';
import { ChartType } from 'chart.js';

@Component({
  selector: 'hospitality-bot-guest-payments-statistics',
  templateUrl: './guest-payments-statistics.component.html',
  styleUrls: ['./guest-payments-statistics.component.scss']
})
export class GuestPaymentsStatisticsComponent implements OnInit {

  @ViewChild(BaseChartDirective) baseChart: BaseChartDirective;

  doughnutChartLabels: Label[] = ['Fully Received', 'Partially Received', 'Not Received'];
  doughnutChartData: MultiDataSet = [
    [161, 60, 180]
  ];
  doughnutChartType: ChartType = 'doughnut';

  chartLegend = false;
  chartColors = [
    {
      backgroundColor: ['#3E8EF7', '#FAA700', '#FF4C52'],
      borderColor: ['#3E8EF7', '#FAA700', '#FF4C52'],
    }
  ];
  chartOptions = {
    elements: {
      center: {
        text: '401',
        text3: "Total Users",
        fontColor: '#000',
        fontFamily: "CalibreWeb, 'Helvetica Neue', Arial ",
        fontSize: 36,
        fontStyle: 'normal'
      }
    },
    cutoutPercentage: 0
  };
  constructor() { }

  ngOnInit(): void {
  }

}
