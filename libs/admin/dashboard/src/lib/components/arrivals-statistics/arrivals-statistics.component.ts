import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'hospitality-bot-arrivals-statistics',
  templateUrl: './arrivals-statistics.component.html',
  styleUrls: ['./arrivals-statistics.component.scss']
})
export class ArrivalsStatisticsComponent implements OnInit {

  @Input() arrived: number = 140;
  @Input() expected: number = 231;
  progress: number = 0;
  constructor() { }

  ngOnInit(): void {
    this.setProgress();
  }

  setProgress() {
    this.progress = (this.arrived / this.expected) * 100;
  }

}
