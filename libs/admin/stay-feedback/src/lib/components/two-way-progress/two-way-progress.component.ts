import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Department } from '../../data-models/statistics.model';

@Component({
  selector: 'hospitality-bot-two-way-progress',
  templateUrl: './two-way-progress.component.html',
  styleUrls: ['./two-way-progress.component.scss'],
})
export class TwoWayProgressComponent implements OnInit {
  @Input() settings: Department;

  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvas1', { static: true }) canvas1: ElementRef<
    HTMLCanvasElement
  >;
  @ViewChild('canvas2', { static: true }) canvas2: ElementRef<
    HTMLCanvasElement
  >;
  @ViewChild('canvas3', { static: true }) canvas3: ElementRef<
    HTMLCanvasElement
  >;
  constructor() {}

  ngOnInit(): void {
    this.drawArcs();
  }

  drawArcs() {
    let cal_values = this.calculatevalues();
    let largest = Math.max(
      this.settings.positive,
      this.settings.negative,
      this.settings.neutral
    );
    let ctx = this.canvas.nativeElement.getContext('2d');
    let ctx1 = this.canvas1.nativeElement.getContext('2d');
    let ctx2 = this.canvas3.nativeElement.getContext('2d');
    ctx.strokeStyle = ctx1.strokeStyle = ctx2.strokeStyle = '#f2f2f2';
    if (this.settings.neutral === largest) {
      this.settings.score >= 0
        ? (ctx.strokeStyle = '#4BA0F5')
        : (ctx2.strokeStyle = '#EF1D45');
    } else if (this.settings.positive === largest) {
      this.settings.score >= 0
        ? (ctx.strokeStyle = '#1AB99F')
        : (ctx2.strokeStyle = '#EF1D45');
    } else {
      ctx2.strokeStyle = '#EF1D45';
    }
    ctx.beginPath();
    ctx1.beginPath();
    ctx2.beginPath();
    ctx.arc(62, 62, 55, 1.5 * Math.PI, cal_values.positiveValue * Math.PI);
    ctx1.arc(62, 62, 55, 0.6 * Math.PI, 0.4 * Math.PI);
    ctx2.arc(62, 62, 55, cal_values.negativeValue * Math.PI, 1.5 * Math.PI);
    ctx.lineWidth = 15;
    ctx1.lineWidth = 15;
    ctx2.lineWidth = 15;
    ctx.stroke();
    ctx1.stroke();
    ctx2.stroke();
  }

  private calculatevalues() {
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
}
