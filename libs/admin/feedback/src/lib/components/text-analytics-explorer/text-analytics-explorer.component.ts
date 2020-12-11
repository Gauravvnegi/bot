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
      strokeWidth: 4
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
      strokeWidth: 6
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
      strokeWidth: 4
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
      strokeWidth: 6
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
      strokeWidth: 8
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
      strokeWidth: 6
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
      strokeWidth: 6
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
      strokeWidth: 6
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
      strokeWidth: 6
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
      strokeWidth: 4
    }
  ]
  constructor() { }

  ngOnInit(): void {
  }

}
