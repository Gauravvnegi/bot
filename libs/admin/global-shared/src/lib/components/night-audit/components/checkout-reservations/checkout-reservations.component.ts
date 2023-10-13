import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActionConfigType } from '../../../../types/night-audit.type';
import { MenuItem } from 'primeng/api';
import {
  cols,
  quickActions,
} from '../../constants/checked-in-reservation.table';
import { CheckedOutReservation } from '../../models/night-audit.model';
import { TableActionType } from '../../../table-view/table-view.component';
import { manageReservationRoutes } from 'libs/admin/manage-reservation/src/lib/constants/routes';
import { ModuleNames } from '@hospitality-bot/admin/shared';

@Component({
  selector: 'hospitality-bot-checkout-reservations',
  templateUrl: './checkout-reservations.component.html',
  styleUrls: [
    '../../night-audit.component.scss',
    './checkout-reservations.component.scss',
  ],
})
export class CheckoutReservationsComponent implements OnInit {
  title = 'Pending Check-out';
  cols = cols;
  @Input() loading = false;
  actionConfig: ActionConfigType;

  @Input() items: CheckedOutReservation[] = [];
  @Input() activeIndex = 0;
  @Input() stepList: MenuItem[];
  @Output() indexChange = new EventEmitter<number>();
  @Output() reload = new EventEmitter();
  @Output() onNavigate = new EventEmitter();

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

  quickChange(event: TableActionType) {
    const isModify = event.value == quickActions.modify;
    const path = isModify
      ? `${manageReservationRoutes.editReservation.route}/${event.details.id}`
      : `${event.details.id}`;
    const submodule = isModify
      ? ModuleNames.ADD_RESERVATION
      : ModuleNames.INVOICE;
    this.onNavigate.emit({
      additionalPath: path,
      subModuleName: submodule,
    });
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
