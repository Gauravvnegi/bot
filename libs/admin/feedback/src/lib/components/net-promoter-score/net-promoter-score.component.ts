import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { JUL } from '@angular/material/core';

@Component({
  selector: 'hospitality-bot-net-promoter-score',
  templateUrl: './net-promoter-score.component.html',
  styleUrls: ['./net-promoter-score.component.scss']
})
export class NetPromoterScoreComponent implements OnInit {

  npsFG: FormGroup;
  documentTypes = [
    { label: 'CSV', value: 'csv' },
    // { label: 'EXCEL', value: 'excel' },
    // { label: 'PDF', value: 'pdf' },
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
      { data: [85, 70, 60, 80, 40, 75, 60, 75, 25, 43, 80, 62, 55, 75, 75, 55, 45, 60, 75, 70], label: 'Overall NPS' },
    ],
    chartLabels: ['11 JUL', '25 Jul', '8 Aug', '22 Aug', '5 Sep', '19 Sep', '3 Oct', '17 Oct', '31 Oct', '14 Nov'],
    chartOptions: {
      responsive: true,
      scales: {
        xAxes: [
          {
            gridLines: {
              display: true,
            },
          },
        ],
        yAxes: [
          {
            gridLines: {
              display: false,
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
        borderColor: '#0239CF',
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
  }

  initFG(): void {
    this.npsFG = this.fb.group({
      documentType: ['csv'],
      documentActionType: ['Export All']
    })
  }

}
