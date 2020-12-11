import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'hospitality-bot-text-analytics-explorer',
  templateUrl: './text-analytics-explorer.component.html',
  styleUrls: ['./text-analytics-explorer.component.scss']
})
export class TextAnalyticsExplorerComponent implements OnInit {

  progressValues = [
    {
      title: 'Price',
      progress: {
        negative: 5,
        positive: 44,
        no: 42,
        mixed: 9,
      },
      dimension: 84,
      strokeWidth: 4,
      style: `position: absolute;
      left: 8%;
      top: 0;`
    },
    {
      title: 'Payment',
      progress: {
        negative: 5,
        positive: 44,
        no: 42,
        mixed: 9,
      },
      dimension: 130,
      strokeWidth: 6,
      style: `position: absolute;
      left: calc(8% + 100px);
      top: -20px;`
    },
    {
      title: 'Product',
      progress: {
        negative: 5,
        positive: 44,
        no: 42,
        mixed: 9,
      },
      dimension: 84,
      strokeWidth: 4,
      style: `    position: absolute;
      left: calc(8% + 254px);
      top: -60px;`
    },
    {
      title: 'Purchase',
      progress: {
        negative: 5,
        positive: 44,
        no: 42,
        mixed: 9,
      },
      dimension: 130,
      strokeWidth: 6,
      style: `position: absolute;
      top: 110px;
      left: calc(8% + 60px);`
    },
    {
      title: 'Claims',
      progress: {
        negative: 5,
        positive: 44,
        no: 42,
        mixed: 9,
      },
      dimension: 174,
      strokeWidth: 8,
      style: `left: calc(8% + 200px);
      position: absolute;
      top: 125px;`
    },
    {
      title: 'Store',
      progress: {
        negative: 5,
        positive: 44,
        no: 42,
        mixed: 9,
      },
      dimension: 130,
      strokeWidth: 6,
      style: `left: calc(8% + 360px);
      position: absolute;
      top: 25px;`
    },
    {
      title: 'Service',
      progress: {
        negative: 5,
        positive: 44,
        no: 42,
        mixed: 9,
      },
      dimension: 130,
      strokeWidth: 6,
      style: `left: 8%;
      position: absolute;
      top: 240px;`
    },
    {
      title: 'Cusomer Services',
      progress: {
        negative: 5,
        positive: 44,
        no: 42,
        mixed: 9,
      },
      dimension: 130,
      strokeWidth: 6,
      style: `left: calc(8% + 135px);
      position: absolute;
      top: 235px;`
    },
    {
      title: 'Sales',
      progress: {
        negative: 5,
        positive: 44,
        no: 42,
        mixed: 9,
      },
      dimension: 130,
      strokeWidth: 6,
      style: `left: calc(8% + 270px);
      position: absolute;
      top: 255px;`
    },
    {
      title: 'Love',
      progress: {
        negative: 5,
        positive: 44,
        no: 42,
        mixed: 9,
      },
      dimension: 84,
      strokeWidth: 4,
      style: `left: calc(8% + 380px);
      position: absolute;
      top: 130px;`
    }
  ]
  constructor() { }

  ngOnInit(): void {
  }

}
