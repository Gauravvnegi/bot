import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { feedback } from '@hospitality-bot/admin/feedback';
import { Department } from '../../../data-models/statistics.model';
import { DepartmentValue } from '../../../types/feedback.type';

@Component({
  selector: 'hospitality-bot-two-way-progress',
  templateUrl: './two-way-progress.component.html',
  styleUrls: ['./two-way-progress.component.scss'],
})
export class TwoWayProgressComponent implements OnInit {
  @Input() settings: Department;

  @ViewChild('positiveCanvas', { static: true }) positiveCanvas: ElementRef<
    HTMLCanvasElement
  >;
  @ViewChild('defaultCanvas', { static: true }) defaultCanvas: ElementRef<
    HTMLCanvasElement
  >;
  @ViewChild('negativeCanvas', { static: true }) negativeCanvas: ElementRef<
    HTMLCanvasElement
  >;
  constructor() {}

  ngOnInit(): void {
    this.drawArcs();
  }

  /**
   * @function drawArcs To draw the arcs on the canvas.
   */
  drawArcs(): void {
    let cal_values = this.calculatevalues();
    let largest = Math.max(
      this.settings.positive,
      this.settings.negative,
      this.settings.neutral
    );
    let positiveCanvasContext = this.positiveCanvas.nativeElement.getContext(
      '2d'
    );
    let defaultCanvasContext = this.defaultCanvas.nativeElement.getContext(
      '2d'
    );
    let negativeCanvasContext = this.negativeCanvas.nativeElement.getContext(
      '2d'
    );
    positiveCanvasContext.strokeStyle = defaultCanvasContext.strokeStyle = negativeCanvasContext.strokeStyle =
      feedback.defaultColor;
    if (this.settings.neutral === largest) {
      this.settings.score >= 0
        ? (positiveCanvasContext.strokeStyle = feedback.positiveColor)
        : (negativeCanvasContext.strokeStyle = feedback.negativeColor);
    } else if (this.settings.positive === largest) {
      this.settings.score >= 0
        ? (positiveCanvasContext.strokeStyle = feedback.positiveColor)
        : (negativeCanvasContext.strokeStyle = feedback.negativeColor);
    } else {
      negativeCanvasContext.strokeStyle = feedback.negativeColor;
    }
    positiveCanvasContext.beginPath();
    defaultCanvasContext.beginPath();
    negativeCanvasContext.beginPath();
    positiveCanvasContext.arc(
      feedback.canvas.department.x,
      feedback.canvas.department.y,
      feedback.canvas.department.radius,
      1.5 * Math.PI,
      cal_values.positiveValue * Math.PI
    );
    defaultCanvasContext.arc(
      feedback.canvas.department.x,
      feedback.canvas.department.y,
      feedback.canvas.department.radius,
      0.6 * Math.PI,
      0.4 * Math.PI
    );
    negativeCanvasContext.arc(
      feedback.canvas.department.x,
      feedback.canvas.department.y,
      feedback.canvas.department.radius,
      cal_values.negativeValue * Math.PI,
      1.5 * Math.PI
    );
    positiveCanvasContext.lineWidth = defaultCanvasContext.lineWidth = negativeCanvasContext.lineWidth =
      feedback.canvas.department.lineWidth;
    positiveCanvasContext.stroke();
    defaultCanvasContext.stroke();
    negativeCanvasContext.stroke();
  }

  /**
   * @function calculatevalues To calculate department feedback value.
   * @returns The values for a department.
   */
  private calculatevalues(): DepartmentValue {
    let score =
      this.settings.score < 0 ? this.settings.score * -1 : this.settings.score;
    let positiveValue = parseFloat((1.5 + score * 0.009).toFixed(3));
    if (positiveValue > 1.991) {
      if (positiveValue < 2) {
        positiveValue = parseFloat((2 - positiveValue).toFixed(3));
      } else {
        positiveValue = parseFloat((positiveValue - 2).toFixed(3));
      }
    }
    let negativeValue = 1.5 - score * 0.009;
    return {
      positiveValue,
      negativeValue,
    };
  }

  get feedbackConfig() {
    return feedback;
  }
}
