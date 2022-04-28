import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'hospitality-bot-to-dropdown',
  templateUrl: './to-dropdown.component.html',
  styleUrls: ['./to-dropdown.component.scss'],
})
export class ToDropdownComponent implements OnInit {
  @Input() value: string;
  @Input() search = false;
  tabFilterItems = [
    {
      label: 'Subscribers Groups',
      value: 'SUBSCRIBERGROUP',
      chips: [],
    },
    {
      label: 'Listing',
      value: 'LISTING',
      chips: [],
    },
  ];
  tabFilterIdx = 0;
  constructor() {}

  ngOnInit(): void {}

  onSelectedTabFilterChange(event) {
    this.tabFilterIdx = event.index;
  }
}
