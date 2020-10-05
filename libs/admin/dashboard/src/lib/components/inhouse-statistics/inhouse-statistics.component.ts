import { Component, OnInit, Input } from '@angular/core';
import { Inhouse } from '../../data-models/statistics.model';

@Component({
  selector: 'hospitality-bot-inhouse-statistics',
  templateUrl: './inhouse-statistics.component.html',
  styleUrls: ['./inhouse-statistics.component.scss'],
})
export class InhouseStatisticsComponent implements OnInit {
  @Input() inhouse: Inhouse;

  percentStyle: string = '--percentage : 80; --fill: hsla(266, 90%, 54%, 1) ;';
  constructor() {}

  ngOnChanges() {
    this.setPercentageStyle();
  }

  ngOnInit(): void {
    // this.setPercentageStyle();
  }

  setPercentageStyle() {
    let percentage = Math.abs(
      (this.inhouse.roomOccupied / this.inhouse.totalRoom) * 100
    );

    this.percentStyle = `--percentage : ${percentage}; --fill: hsla(266, 90%, 54%, 1) ;`;
  }
}
