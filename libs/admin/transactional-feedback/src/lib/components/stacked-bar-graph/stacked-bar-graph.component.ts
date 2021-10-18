import { Component, Input, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'hospitality-bot-stacked-bar-graph',
  templateUrl: './stacked-bar-graph.component.html',
  styleUrls: ['./stacked-bar-graph.component.scss'],
})
export class StackedBarGraphComponent implements OnInit {
  @Input() tabFilterItems = [];
  @Input() tabFilterIdx = 0;
  progresses = [
    {
      label: 'Breakfast',
      data: [
        { label: 'À la carte', score: 60 },
        { label: 'Buffet', score: 50 },
      ],
    },
    {
      label: 'Lunch',
      data: [
        { label: 'À la carte', score: 60 },
        { label: 'Buffet', score: 50 },
      ],
    },
    {
      label: 'Dinner',
      data: [
        { label: 'À la carte', score: 25 },
        { label: 'Buffet', score: 50 },
      ],
    },
  ];

  constructor() {}

  ngOnInit(): void {}

  get maxBarCount() {
    if (this.tabFilterItems[this.tabFilterIdx].chips[0].isSelected) {
      return this.tabFilterItems[this.tabFilterIdx].chips.length - 1;
    }
    return this.tabFilterItems[this.tabFilterIdx].chips.filter(
      (d) => d.isSelected
    ).length;
  }
}
