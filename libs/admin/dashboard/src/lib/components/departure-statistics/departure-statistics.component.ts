import { Component, OnInit, Input } from '@angular/core';
import { Departures } from '../../data-models/statistics.model';

@Component({
  selector: 'hospitality-bot-departure-statistics',
  templateUrl: './departure-statistics.component.html',
  styleUrls: ['./departure-statistics.component.scss']
})
export class DepartureStatisticsComponent implements OnInit {

  @Input() departures: Departures;
  constructor() { }

  ngOnInit(): void {
  }

}
