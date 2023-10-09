import { Component, Input, OnInit } from '@angular/core';
import { feedback } from '../../../constants/feedback';
import { NPSDepartments } from '../../../data-models/statistics.model';

@Component({
  selector: 'hospitality-bot-department-bar-graph',
  templateUrl: './department-bar-graph.component.html',
  styleUrls: ['./department-bar-graph.component.scss'],
})
export class DepartmentBarGraphComponent implements OnInit {
  @Input() npsChartData: NPSDepartments;
  feedbackConfig = feedback;
  constructor() {}

  ngOnInit(): void {}
}
