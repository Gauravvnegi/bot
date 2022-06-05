import { Component, OnInit } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { StatisticsService } from '@hospitality-bot/admin/shared';
import { Subscription } from 'rxjs';
import { FeedbackTableService } from '../../../services/table.service';

@Component({
  selector: 'hospitality-bot-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  tabFilterItems = [
    {
      label: 'GTM',
      value: 'GTM',
      total: 0,
    },
    {
      label: 'All',
      value: 'ALL',
      total: 0,
    },
  ];
  tabFilterIdx = 0;
  constructor() {}

  ngOnInit(): void {}

  onSelectedTabFilterChange(event) {
    this.tabFilterIdx = event.index;
  }
}
