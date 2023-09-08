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
  selector: 'hospitality-bot-banquet-form',
  templateUrl: './banquet-form.component.html',
  styleUrls: ['./banquet-form.component.scss'],
})
export class BanquetFormComponent implements OnInit {
  @Input() isLoading = false;
  @Input() isPaidLoading = false;
  @Input() isCompLoading = false;
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
  constructor(
    public controlContainer: ControlContainer,
    public outletService: OutletService
  ) {}

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
