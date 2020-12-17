import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { JUL } from '@angular/material/core';

@Component({
  selector: 'hospitality-bot-net-promoter-score',
  templateUrl: './net-promoter-score.component.html',
  styleUrls: [
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './net-promoter-score.component.scss'
  ]
})
export class NetPromoterScoreComponent implements OnInit {

  npsFG: FormGroup;
  documentTypes = [
    { label: 'CSV', value: 'csv' },
    // { label: 'EXCEL', value: 'excel' },
    // { label: 'PDF', value: 'pdf' },
  ];

  chartTypes = [
    { name: 'Bar', value: 'bar', url: 'assets/svg/bar-graph.svg' },
    { name: 'Line', value: 'line', url: 'assets/svg/line-graph.svg' },
  ];

  documentActionTypes = [
    {
      label: 'Export All',
      value: 'exportAll',
      type: '',
      defaultLabel: 'Export All',
    },
    {
      label: `Export`,
      value: 'export',
      type: 'countType',
      defaultLabel: 'Export',
    },
  ];

  chart: any = {
    chartData: [
      {
        data: [95, 85, 70, 65, 80, 40, 75, 60, 75, 25, 43, 80, 62, 55, 75, 75, 55, 45, 60, 75, 70],
        label: 'Overall NPS'
      },
    ],
    chartLabels: [
      new Date(2020, 7, 4),
      new Date(2020, 7, 11),
      new Date(2020, 7, 17),
      new Date(2020, 7, 25),
      new Date(2020, 7, 31),
      new Date(2020, 8, 8),
      new Date(2020, 8, 15),
      new Date(2020, 8, 22),
      new Date(2020, 8, 30),
      new Date(2020, 9, 5),
      new Date(2020, 9, 12),
      new Date(2020, 9, 19),
      new Date(2020, 9, 28),
      new Date(2020, 10, 3),
      new Date(2020, 10, 10),
      new Date(2020, 10, 17),
      new Date(2020, 10, 25),
      new Date(2020, 10, 31),
      new Date(2020, 11, 5),
      new Date(2020, 11, 14),
      new Date(2020, 11, 22)
    ],
    chartOptions: {
      responsive: true,
      elements: {
        line: {
          tension: 0
        }
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              display: false,
            },
          },
        ],
        yAxes: [
          {
            gridLines: {
              display: true,
            },
            ticks: {
              min: 0,
              stepSize: 20,
            },
          },
        ],
      },
    },
    chartColors: [
      {
        borderColor: '#0C8054',
        backgroundColor: '#DEFFF3',
      },
    ],
    chartLegend: false,
    chartType: 'line',
  };

  
  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initFG();
    this.setChartLabels();
  }

  initFG(): void {
    this.npsFG = this.fb.group({
      documentType: ['csv'],
      documentActionType: ['Export All']
    })
  }

  setChartLabels(): void {
    let i = 0;
    this.chart.chartLabels.forEach(element => {
      this.chart.chartLabels[i] = element.toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short'
      }).replace(/ /g, ' ');
      i = i+1;
    });
  }

  modifyXLabels() {

  }

  setChartType(option): void {
    this.chart.chartType = option.value;
  }

}
