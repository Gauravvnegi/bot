import { Component, OnInit, Input } from '@angular/core';
import { ExpressCheckIn } from '../../data-models/statistics.model';

@Component({
  selector: 'hospitality-bot-checkin-statistics',
  templateUrl: './checkin-statistics.component.html',
  styleUrls: ['./checkin-statistics.component.scss']
})
export class CheckinStatisticsComponent implements OnInit {

  @Input() expectedCheckIn: ExpressCheckIn;
  constructor() { }

  ngOnInit(): void {
  }

}
