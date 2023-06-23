import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'hospitality-bot-feedback-wrapper',
  templateUrl: './feedback-wrapper.component.html',
  styleUrls: ['./feedback-wrapper.component.scss'],
})
export class FeedbackWrapperComponent implements OnInit {
  welcomeMessage = 'Welcome to Heda Feedback';
  navRoutes = [{ label: 'Heda Feedback', link: './' }];
  tabFilterIdx = 0;
  globalFeedbackFilterType = '';
  tabFilterItems = [
    {
      label: 'All',
      content: '',
      value: 'ALL',
      disabled: false,
      chips: [],
      type: 'Both',
    },
  ];
  constructor() {}

  ngOnInit(): void {}

  onSelectedTabFilterChange(event): void {}

  getTabItem(item, type) {
    return {
      label: item.name,
      content: '',
      value: item.id,
      disabled: false,
      chips: [],
      type: type,
    };
  }
}
