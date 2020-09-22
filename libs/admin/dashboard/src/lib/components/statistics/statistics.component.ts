import { Component, OnInit } from '@angular/core';
import { StatisticsService } from '../../services/statistics.service';
import { Statistics } from '../../data-models/statistics.model';

@Component({
  selector: 'hospitality-bot-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {

  statistics: Statistics;
  constructor(private _statisticService: StatisticsService) { }

  ngOnInit(): void {
    this.getStatistics();
  }

  getStatistics() {
    this._statisticService.getStatistics('ca60640a-9620-4f60-9195-70cc18304edd')
      .subscribe((response) => {
        this.statistics = new Statistics().deserialize(response);
      })
  }

}
