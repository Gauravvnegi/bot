import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'hospitality-bot-checkin-statistics',
  templateUrl: './checkin-statistics.component.html',
  styleUrls: ['./checkin-statistics.component.scss']
})
export class CheckinStatisticsComponent implements OnInit {

  @Input() expectedCheckIn:number = 12;
  constructor() { }

  ngOnInit(): void {
  }

}
