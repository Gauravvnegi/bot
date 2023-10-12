import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActionConfigType } from '../../../../types/night-audit.type';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { cols } from '../../constants/checked-in-reservation.table';
import { CheckedInReservation } from '../../models/night-audit.model';

@Component({
  selector: 'hospitality-bot-checkin-reservations',
  templateUrl: './checkin-reservations.component.html',
  styleUrls: [
    '../../night-audit.component.scss',
    '../checkout-reservations/checkout-reservations.component.scss',
    './checkin-reservations.component.scss',
  ],
  providers: [ConfirmationService],
})
export class CheckinReservationsComponent implements OnInit {
  title = 'Pending Check-ins';
  cols = cols;
  actionConfig: ActionConfigType;

  @Input() loading = false;
  @Input() items: CheckedInReservation[] = [];
  @Input() activeIndex = 0;
  @Input() stepList: MenuItem[];
  @Output() indexChange = new EventEmitter<number>();
  @Output() reload = new EventEmitter();

  constructor(private confirmationService: ConfirmationService) {}

  ngOnInit(): void {
    this.initActionConfig();
    this.initTable();
  }

  initActionConfig(postLabel?: string) {
    this.actionConfig = {
      preHide: this.activeIndex == 0,
      preLabel: this.activeIndex != 0 ? 'Back' : undefined,
      postLabel: 'Next',
      preSeverity: 'primary',
    };
  }

  statusChange(event) {
    this.confirmationService.confirm({
      header: `Status Change ${event}`,
      message: 'Do You want to continue ?',
      acceptButtonStyleClass: 'accept-button',
      rejectButtonStyleClass: 'reject-button-outlined',
      accept: () => {
        // debugger;
      },
    });
  }

  initTable() {
    if (!this.items.length) this.reloadTable();
  }

  reloadTable() {
    this.reload.emit(true);
  }

  handleNext() {
    if (this.activeIndex + 1 < this.stepList.length)
      this.indexChange.emit(this.activeIndex + 1);
  }

  handlePrev() {
    if (this.activeIndex > 0) this.indexChange.emit(this.activeIndex - 1);
  }
}
