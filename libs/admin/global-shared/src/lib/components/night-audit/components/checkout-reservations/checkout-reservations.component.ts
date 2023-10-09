import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActionConfigType } from '../../../../types/night-audit.type';
import { cols, usersList } from '../../constants/manage-login.table';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'hospitality-bot-checkout-reservations',
  templateUrl: './checkout-reservations.component.html',
  styleUrls: [
    '../../night-audit.component.scss',
    './checkout-reservations.component.scss',
  ],
})
export class CheckoutReservationsComponent implements OnInit {
  title = 'Checkout Reservation';
  cols = cols;
  users = usersList;
  loading = false;
  actionConfig: ActionConfigType;

  @Input() activeIndex = 0;
  @Input() stepList: MenuItem[];
  @Output() indexChange = new EventEmitter<number>();

  constructor() {}

  ngOnInit(): void {
    this.initActionConfig();
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
