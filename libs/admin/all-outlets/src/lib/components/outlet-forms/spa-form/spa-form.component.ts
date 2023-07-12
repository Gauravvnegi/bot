import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { days, hours } from '../../../constants/data';
import { Feature } from '../../../types/outlet';
import {
  noRecordActionForComp,
  noRecordActionForCompWithId,
  noRecordActionForMenu,
  noRecordActionForMenuWithId,
  noRecordActionForPaid,
  noRecordActionForPaidWithId,
} from '../../../constants/form';

@Component({
  selector: 'hospitality-bot-spa-form',
  templateUrl: './spa-form.component.html',
  styleUrls: ['./spa-form.component.scss'],
})
export class SpaFormComponent implements OnInit {
  days = days;
  hours = hours;
  noRecordActionForComp = noRecordActionForComp;
  noRecordActionForMenu = noRecordActionForMenu;
  noRecordActionForPaid = noRecordActionForPaid;
  @Input() isLoading = false;
  @Input() compServices: any[] = [];
  @Input() paidServices: any[] = [];

  @Input() set outletId(id: string) {
    if (id) {
      this.modifyNoRecordActions();
    }
  }
  @Output() onCreateAndContinueFeature = new EventEmitter<Feature>();

  constructor(public controlContainer: ControlContainer) {}

  ngOnInit(): void {}
  onCreateAndContinue(features: Feature) {
    this.onCreateAndContinueFeature.emit(features);
  }

  modifyNoRecordActions() {
    this.noRecordActionForComp = noRecordActionForCompWithId;
    this.noRecordActionForMenu = noRecordActionForMenuWithId;
    this.noRecordActionForPaid = noRecordActionForPaidWithId;
  }
}
