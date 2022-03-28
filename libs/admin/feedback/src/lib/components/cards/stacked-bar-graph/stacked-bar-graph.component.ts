import { Component, Input, OnInit } from '@angular/core';
import { feedback } from '../../..//constants/feedback';

@Component({
  selector: 'hospitality-bot-stacked-bar-graph',
  templateUrl: './stacked-bar-graph.component.html',
  styleUrls: ['./stacked-bar-graph.component.scss'],
})
export class StackedBarGraphComponent implements OnInit {
  feedbackConfig = feedback;
  @Input() tabFilterItems = [];
  @Input() tabFilterIdx = 0;
  @Input() data;
  @Input() progresses = [];

  constructor() {}

  ngOnInit(): void {}

  get maxBarCount() {
    return this.data?.chipLabels.length || 1;
  }
}
