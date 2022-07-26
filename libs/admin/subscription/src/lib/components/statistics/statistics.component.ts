import { Component, Input, OnInit } from '@angular/core';
import {
  PlanUsageCharts,
  PlanUsagePercentage,
} from '../../data-models/subscription.model';

@Component({
  selector: 'hospitality-bot-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnInit {
  @Input() subscriptionPlanUsage;
  @Input() planUsageChartData: PlanUsageCharts;
  @Input() featureData;
  @Input() planUsagePercentage: PlanUsagePercentage;

  constructor() {}

  ngOnInit(): void {}
}
