import { Component, OnInit, Input } from '@angular/core';
import { Arrivals } from '../../data-models/statistics.model';

@Component({
  selector: 'hospitality-bot-arrivals-statistics',
  templateUrl: './arrivals-statistics.component.html',
  styleUrls: ['./arrivals-statistics.component.scss'],
})
export class ArrivalsStatisticsComponent implements OnInit {
  @Input() arrivals: Arrivals;

  progress: number = 0;
  constructor() {}

  ngOnChanges() {
    this.setProgress();
  }

  ngOnInit(): void {
    //  this.setProgress();
  }

  setProgress() {
    if (this.arrivals.maxExpected) {
      this.progress = Math.abs(
        (this.arrivals.currentlyArrived / this.arrivals.maxExpected) * 100
      );
    } else {
      this.progress = 0;
    }
  }
}
