import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartType } from 'chart.js';
import { BaseChartDirective, Label, MultiDataSet, PluginServiceGlobalRegistrationAndOptions } from 'ng2-charts';

@Component({
  selector: 'hospitality-bot-source-statistics',
  templateUrl: './source-statistics.component.html',
  styleUrls: ['./source-statistics.component.scss']
})
export class SourceStatisticsComponent implements OnInit {

  // @ViewChild(BaseChartDirective) baseChart: BaseChartDirective;
  chart: any = {
    Labels: ['Bot', 'Website', 'Weblink', 'Others'],
    Data: [
      [161, 60, 180, 84]
    ],
    Type: 'doughnut',
    Legend : false,
    Colors : [
      {
        backgroundColor: ['#745AF2', '#3E8EF7', '#0BB2D4', '#FAA700'],
        borderColor: ['#745AF2', '#3E8EF7', '#0BB2D4', '#FAA700'],
      }
    ],
    Options : {
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
      cutoutPercentage: 75
    },
  };
  
  constructor() { }

  ngOnInit(): void {
  }

}
