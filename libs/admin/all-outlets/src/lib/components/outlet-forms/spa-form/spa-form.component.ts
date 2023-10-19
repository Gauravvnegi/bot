import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { Option } from '@hospitality-bot/admin/shared';
import {
  noRecordActionForComp,
  noRecordActionForCompWithId,
  noRecordActionForMenu,
  noRecordActionForMenuWithId,
  noRecordActionForPaid,
  noRecordActionForPaidWithId,
} from '../../../constants/form';
import { OutletService } from '../../../services/outlet.service';
import { Feature } from '../../../types/outlet';

@Component({
  selector: 'hospitality-bot-spa-form',
  templateUrl: './spa-form.component.html',
  styleUrls: ['./spa-form.component.scss'],
})
export class SpaFormComponent implements OnInit {
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

  constructor(
    public controlContainer: ControlContainer,
    private outletService: OutletService
  ) {}

  ngOnInit(): void {
  }

  onCreateAndContinue(features: Feature) {
    this.onCreateAndContinueFeature.emit(features);
  }

  modifyNoRecordActions() {
    this.noRecordActionForComp = noRecordActionForCompWithId;
    this.noRecordActionForMenu = noRecordActionForMenuWithId;
    this.noRecordActionForPaid = noRecordActionForPaidWithId;
  }
}
