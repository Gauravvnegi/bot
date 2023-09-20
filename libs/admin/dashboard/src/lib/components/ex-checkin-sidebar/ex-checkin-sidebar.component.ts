import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'hospitality-bot-ex-checkin-sidebar',
  templateUrl: './ex-checkin-sidebar.component.html',
  styleUrls: ['./ex-checkin-sidebar.component.scss'],
})
export class ExCheckinSidebarComponent implements OnInit {
  @Output() onCloseSidebar = new EventEmitter();

  timestamps: string[] = [];
  tabFilterItems = [
    { label: 'Guest', value: 'GUEST' },
    { label: 'Pre-Arrival Request', value: 'PRE_ARRIVAL_REQUEST' },
  ];

  tabFilterIdx = 0;

  constructor() {}

  ngOnInit(): void {
  }

  onSelectedTabFilterChange(index: number) {
    this.tabFilterIdx = index;
  }
}
