import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { dimensions, days, hours } from '../../../constants/data';
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
  selector: 'hospitality-bot-banquet-form',
  templateUrl: './banquet-form.component.html',
  styleUrls: ['./banquet-form.component.scss'],
})
export class BanquetFormComponent implements OnInit {
  @Input() isLoading = false;
  @Input() isPaidLoading = false;
  @Input() isCompLoading = false;

  hours = hours;
  days = days;
  dimensions = dimensions;
  noRecordActionForComp = noRecordActionForComp;
  noRecordActionForMenu = noRecordActionForMenu;
  noRecordActionForPaid = noRecordActionForPaid;
  isOutletId: boolean = false;

  @Input() set outletId(id: string) {
    if (id) {
      this.isOutletId = true;
      this.modifyNoRecordActions();
    }
  }
  @Input() compServices: any[] = [];
  @Input() paidServices: any[] = [];
  @Output() onCreateAndContinueFeature = new EventEmitter<Feature>();
  constructor(public controlContainer: ControlContainer) {}

  ngOnInit(): void {}

  onCreateAndContinue(features: Feature) {
    this.onCreateAndContinueFeature.emit(features);
  }

  modifyNoRecordActions() {
    this.noRecordActionForComp = noRecordActionForCompWithId;
    this.noRecordActionForPaid = noRecordActionForPaidWithId;
    this.noRecordActionForMenu = noRecordActionForMenuWithId;
  }
}
