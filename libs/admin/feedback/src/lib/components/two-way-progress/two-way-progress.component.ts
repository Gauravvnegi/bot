import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'hospitality-bot-two-way-progress',
  templateUrl: './two-way-progress.component.html',
  styleUrls: ['./two-way-progress.component.scss']
})
export class TwoWayProgressComponent implements OnInit {

  @Input() settings = {
    title: 'Reservation',
    progress: {
      negative: 50,
      positive: 60,
    }
  };

  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvas1', { static: true }) canvas1: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvas2', { static: true }) canvas2: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvas3', { static: true }) canvas3: ElementRef<HTMLCanvasElement>;
  constructor() { }

  ngOnInit(): void {
    this.drawArcs();
  }

  drawArcs() {
    let positiveValue = parseFloat((1.5 + (this.settings.progress.positive * 0.009)).toFixed(3));
    if (positiveValue > 1.991) {
      if (positiveValue < 2 ) {
        positiveValue = parseFloat((2 - positiveValue).toFixed(3));
      } else {
        positiveValue = parseFloat((positiveValue - 2).toFixed(3));
      }
    }
    let negativeValue = 1.5 - (this.settings.progress.negative * 0.009);
    let ctx = this.canvas.nativeElement.getContext("2d");
    let ctx1 = this.canvas1.nativeElement.getContext("2d");
    let ctx3 = this.canvas3.nativeElement.getContext("2d");
    ctx.beginPath();
    ctx1.beginPath();
    ctx3.beginPath();
    ctx.arc(62, 62, 55, 1.5 *  Math.PI, positiveValue * Math.PI);
    ctx1.arc(62, 62, 55, 0.6*  Math.PI, 0.4 * Math.PI);
    ctx3.arc(62, 62, 55, negativeValue * Math.PI, 1.5 * Math.PI);
    ctx.lineWidth = 10;
    ctx1.lineWidth = 10;
    ctx3.lineWidth = 10;
    ctx.strokeStyle="blue";
    ctx1.strokeStyle="gray";
    ctx3.strokeStyle="red";
    ctx.stroke();
    ctx1.stroke();
    ctx3.stroke();
  }

}
