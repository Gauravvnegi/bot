import { Component, OnInit, Input } from '@angular/core';
import { Arrivals } from '../../data-models/statistics';

@Component({
  selector: 'hospitality-bot-arrivals-statistics',
  templateUrl: './arrivals-statistics.component.html',
  styleUrls: ['./arrivals-statistics.component.scss']
})
export class ArrivalsStatisticsComponent implements OnInit {

  @Input() arrivals: Arrivals = {
    currentlyArrived: 140,
    currentlyExpected: 91,
    maxExpected: 231
  }

  progress: number = 0;
  constructor() { }

  ngOnInit(): void {
    this.setProgress();
  }

  setProgress() {
    this.progress = Math.abs((this.arrivals.currentlyArrived / this.arrivals.maxExpected) * 100);
  }

}
