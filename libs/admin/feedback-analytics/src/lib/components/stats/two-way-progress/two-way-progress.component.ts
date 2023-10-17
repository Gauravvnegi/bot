import { Component, OnInit, Input } from '@angular/core';
import { feedback } from '../../../constants/feedback';
import { Department } from '../../../data-models/statistics.model';

@Component({
  selector: 'hospitality-bot-two-way-progress',
  templateUrl: './two-way-progress.component.html',
  styleUrls: ['./two-way-progress.component.scss'],
})
export class TwoWayProgressComponent implements OnInit {
  canvasWidth = 300;
  needleValue = 50;
  centralLabel = '0';
  options = {
    hasNeedle: true,
    needleColor: 'gray',
    needleUpdateSpeed: 1000,
    arcColors: ['#ff6384', '#ff9f40', '#4bc0c0'],
    arcDelimiters: [33, 66],
    rangeLabel: ['-100', '100'],
    scale: { min: -100, max: 100 },
    arcLabels: ['-10', '30'],
    needleStartValue: 50,
  };

  @Input() settings: Department;

  constructor() {}

  ngOnInit(): void {
    this.centralLabel = this.settings.score.toString();
    if (this.settings.score && this.settings.score > 0) {
      this.needleValue = this.settings.score / 2 + 50;
    } else if (this.settings.score && this.settings.score < 0) {
      this.needleValue = this.settings.score / 2 - 50;
    }
  }

  get feedbackConfig() {
    return feedback;
  }
}
