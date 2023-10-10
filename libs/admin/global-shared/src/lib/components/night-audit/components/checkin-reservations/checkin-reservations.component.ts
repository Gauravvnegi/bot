import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActionConfigType } from '../../../../types/night-audit.type';
import { MenuItem } from 'primeng/api';
import {
  cols,
  checkedInList,
} from '../../constants/checked-in-reservation.table';

@Component({
  selector: 'hospitality-bot-checkin-reservations',
  templateUrl: './checkin-reservations.component.html',
  styleUrls: [
    '../../night-audit.component.scss',
    '../checkout-reservations/checkout-reservations.component.scss',
    './checkin-reservations.component.scss',
  ],
})
export class CheckinReservationsComponent implements OnInit {
  title = 'Pending Check-ins';
  cols = cols;
  users = checkedInList;
  loading = false;
  actionConfig: ActionConfigType;

  @Input() activeIndex = 0;
  @Input() stepList: MenuItem[];
  @Output() indexChange = new EventEmitter<number>();

  constructor() {}

  ngOnInit(): void {
    this.initTable();
    this.initActionConfig();
  }

  initTable() {
    this.loading = true;
    this.users = checkedInList;
    this.loading = false;
  }

  initActionConfig(postLabel?: string) {
    this.actionConfig = {
      preHide: this.activeIndex == 0,
      preLabel: this.activeIndex != 0 ? 'Back' : undefined,
      postLabel: 'Next',
      preSeverity: 'primary',
    };
  }

  handleNext() {
    if (this.activeIndex + 1 < this.stepList.length)
      this.indexChange.emit(this.activeIndex + 1);
  }

  handlePrev() {
    if (this.activeIndex > 0) this.indexChange.emit(this.activeIndex - 1);
  }
}
