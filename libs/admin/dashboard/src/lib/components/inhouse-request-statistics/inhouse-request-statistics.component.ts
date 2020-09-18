import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'hospitality-bot-inhouse-request-statistics',
  templateUrl: './inhouse-request-statistics.component.html',
  styleUrls: ['./inhouse-request-statistics.component.scss']
})
export class InhouseRequestStatisticsComponent implements OnInit {

  public doughnutChartLabels = ['Request Approved', 'Request Pending'];
  public doughnutChartData = [146, 255];
  public doughnutChartType = 'doughnut';
  constructor() { }

  ngOnInit(): void {
  }

}
