import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'hospitality-bot-stacked-bar-graph',
  templateUrl: './stacked-bar-graph.component.html',
  styleUrls: ['./stacked-bar-graph.component.scss'],
})
export class StackedBarGraphComponent implements OnInit {
  @Input() tabFilterItems = [];
  @Input() tabFilterIdx = 0;
  @Input() data;
  progresses = [];

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges() {
    this.setProgresses();
  }

  setProgresses() {
    this.progresses = [];
    if (this.data.verticalData) {
      Object.keys(this.data.verticalData).forEach((key) => {
        if (this.data.verticalData[key].length)
          this.progresses.push({
            label: key,
            data: this.data.verticalData[key],
          });
      });
    }
  }

  get maxBarCount() {
    return this.data?.chipLabels.length || 1;
  }
}
