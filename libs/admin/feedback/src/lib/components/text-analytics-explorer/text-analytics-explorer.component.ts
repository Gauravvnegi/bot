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
      left: 10%;
      top: 0;`
    },
    {
      title: 'Price',
      progress: {
        negative: 5,
        positive: 44,
        no: 42,
        mixed: 9,
      },
      dimension: 130,
      strokeWidth: 6,
      style: `position: absolute;
      left: calc(10% + 100px);
      top: -20px;`
    },
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
      style: `    position: absolute;
      left: calc(10% + 254px);
      top: -60px;`
    },
    {
      title: 'Price',
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
      left: calc(10% + 60px);`
    },
    {
      title: 'Price',
      progress: {
        negative: 5,
        positive: 44,
        no: 42,
        mixed: 9,
      },
      dimension: 174,
      strokeWidth: 8,
      style: `left: calc(10% + 200px);
      position: absolute;
      top: 125px;`
    },
    {
      title: 'Price',
      progress: {
        negative: 5,
        positive: 44,
        no: 42,
        mixed: 9,
      },
      dimension: 130,
      strokeWidth: 6,
      style: `left: calc(10% + 360px);
      position: absolute;
      top: 25px;`
    },
    {
      title: 'Price',
      progress: {
        negative: 5,
        positive: 44,
        no: 42,
        mixed: 9,
      },
      dimension: 130,
      strokeWidth: 6,
      style: `left: 10%;
      position: absolute;
      top: 240px;`
    },
    {
      title: 'Price',
      progress: {
        negative: 5,
        positive: 44,
        no: 42,
        mixed: 9,
      },
      dimension: 130,
      strokeWidth: 6,
      style: `left: calc(10% + 135px);
      position: absolute;
      top: 235px;`
    },
    {
      title: 'Price',
      progress: {
        negative: 5,
        positive: 44,
        no: 42,
        mixed: 9,
      },
      dimension: 130,
      strokeWidth: 6,
      style: `left: calc(10% + 270px);
      position: absolute;
      top: 255px;`
    },
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
      style: `left: calc(10% + 380px);
      position: absolute;
      top: 130px;`
    }
  ]
  constructor() { }

  ngOnInit(): void {
  }

}
