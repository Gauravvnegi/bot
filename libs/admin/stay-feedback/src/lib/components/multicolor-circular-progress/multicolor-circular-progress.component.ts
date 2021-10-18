import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'hospitality-bot-multicolor-circular-progress',
  templateUrl: './multicolor-circular-progress.component.html',
  styleUrls: ['./multicolor-circular-progress.component.scss']
})
export class MulticolorCircularProgressComponent implements OnInit {
  @Input() settings = {
    title: 'Price',
    progress: {
      negative: 5,
      positive: 44,
      no: 42,
      mixed: 9,
    },
    dimension: 174,
    strokeWidth: 8
  };

  labelDimension;

  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvas1', { static: true }) canvas1: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvas2', { static: true }) canvas2: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvas3', { static: true }) canvas3: ElementRef<HTMLCanvasElement>;
  constructor() { }

  ngOnInit(): void {
    if (this.settings && this.canvas) {
      this.drawArcs();
      this.labelDimension = `height: ${this.settings.dimension}px; width: ${this.settings.dimension}px;`;
    }
  }

  drawArcs() {
    let dimension = Math.floor(this.settings.dimension / 2);
    let radius = Math.floor((this.settings.dimension / 2) - this.settings.strokeWidth);
    let positiveValue = parseFloat((this.settings.progress.positive * 0.02).toFixed(6));
    let noValue = parseFloat((this.settings.progress.no * 0.02 + positiveValue).toFixed(6));
    let mixedValue = parseFloat((this.settings.progress.mixed * 0.02 + noValue).toFixed(6));
    let ctx = this.canvas.nativeElement.getContext("2d");
    let ctx1 = this.canvas1.nativeElement.getContext("2d");
    let ctx2 = this.canvas2.nativeElement.getContext("2d");
    let ctx3 = this.canvas3.nativeElement.getContext("2d");
    ctx.beginPath();
    ctx1.beginPath();
    ctx2.beginPath();
    ctx3.beginPath();
    ctx.arc(dimension, dimension, radius, 0 *  Math.PI, positiveValue * Math.PI);
    ctx1.arc(dimension, dimension, radius, positiveValue *  Math.PI, noValue * Math.PI);
    ctx2.arc(dimension, dimension, radius, noValue *  Math.PI, mixedValue * Math.PI)
    ctx3.arc(dimension, dimension, radius, mixedValue *  Math.PI, 1.999999 * Math.PI);
    ctx.lineWidth = this.settings.strokeWidth;
    ctx1.lineWidth = this.settings.strokeWidth;
    ctx2.lineWidth = this.settings.strokeWidth;
    ctx3.lineWidth = this.settings.strokeWidth;
    ctx.strokeStyle="#0BB2D4";
    ctx1.strokeStyle="#3E8EF7";
    ctx2.strokeStyle = '#FAA700';
    ctx3.strokeStyle="#F4226B";
    ctx.stroke();
    ctx1.stroke();
    ctx2.stroke();
    ctx3.stroke();
  }
}
