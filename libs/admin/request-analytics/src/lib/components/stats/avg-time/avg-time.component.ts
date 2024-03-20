import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'avg-time',
  templateUrl: './avg-time.component.html',
  styleUrls: ['./avg-time.component.scss'],
})
export class AvgTimeComponent implements OnInit {
  constructor() {}

  dataLoaded = false;

  ngOnInit(): void {}

  public chart = {
    datasets: [
      {
        data: [],
        label: 'Line',
        type: 'line',
        fill: false,
        borderColor: ['#000000'],
        backgroundColor: ['#000000'],
        tooltipHidden: false,
      },
      {
        data: [],
        backgroundColor: [],
        hoverBackgroundColor: [],
        borderColor: [],
        label: 'ART',
        tooltipHidden: false,
      },
    ],
    labels: [],
    options: {
      elements: {
        line: {
          tension: 0,
        },
        point: {
          radius: 0,
          borderWidth: 2,
          hitRadius: 5,
          hoverRadius: 0,
          hoverBorderWidth: 2,
        },
      },
      tooltips: {
        backgroundColor: 'white',
        bodyFontColor: 'black',
        borderColor: '#f4f5f6',
        borderWidth: 3,
        titleFontColor: 'black',
        titleMarginBottom: 5,
        xPadding: 10,
        yPadding: 10,
        filter: function (tooltipItem, data) {
          return !data.datasets[tooltipItem.datasetIndex].tooltipHidden; // custom added prop to dataset
        },
        callbacks: {
          label: function (context) {
            if (context.value !== null) {
              return ' ART: ' + context.value + ' hrs';
            }
          },
        },
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              callback: function (value, index, ticks) {
                return value + ' hrs';
              },
            },
          },
        ],
        xAxes: [
          {
            ticks: {
              min: 'Monday',
              max: 'Sunday',
            },
            gridLines: {
              display: false,
            },
          },
        ],
      },
    },
    legend: false,
  };
}
