import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'hospitality-bot-inhouse-statistics',
  templateUrl: './inhouse-statistics.component.html',
  styleUrls: ['./inhouse-statistics.component.scss']
})
export class InhouseStatisticsComponent implements OnInit {

  @Input() adultCount: number = 5;
  @Input() kidsCount:number = 0;
  @Input() roomOccupied: number = 30;
  percentStyle: string = "--percentage : 80; --fill: hsla(266, 90%, 54%, 1) ;";
  constructor() { }

  ngOnInit(): void {
    this.setPercentageStyle();
  }

  setPercentageStyle() {
    this.percentStyle = `--percentage : ${this.roomOccupied}; --fill: hsla(266, 90%, 54%, 1) ;`;
  }

}
