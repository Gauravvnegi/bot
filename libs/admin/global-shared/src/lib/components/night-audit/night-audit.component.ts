import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { NightAuditService } from '../../services/night-audit.service';
import { FormActionConfig } from 'libs/admin/shared/src/lib/components/form-component/form-action/form-action.component';
import { itemList } from '../../constants/night-audit.const';

@Component({
  selector: 'night-audit',
  templateUrl: './night-audit.component.html',
  styleUrls: ['./night-audit.component.scss'],
})
export class NightAuditComponent implements OnInit {
  constructor() {}
  @Input() isSidebar = true;
  @Input() onClose = new EventEmitter();
  pageTitle = 'Night Audit';
  currentDate = new Date();
  itemList = itemList;
  actionConfig: ActionConfigType;
  activeStep = 0;
  loading = false;

  ngOnInit(): void {
    this.initActionConfig();
  }

  initActionConfig() {
    this.actionConfig = {
      preHide: this.activeStep == 0,
      preLabel: this.activeStep != 0 ? 'Back' : undefined,
      postLabel: this.activeStep == 0 ? 'Forcefully Logout Users >' : 'Next',
      preSeverity: 'primary',
    };
  }

  handleNext() {
    if (this.activeStep + 1 < this.itemList.length) {
      this.activeStep = this.activeStep + 1;
    }
    this.initActionConfig();
  }

  handlePrev() {
    if (this.activeStep > 0) {
      this.activeStep = this.activeStep - 1;
    }
    this.initActionConfig();
  }

  onActive(event) {
    this.activeStep = event.index;
  }

  close() {
    this.onClose.emit(false);
  }
}

export type ActionConfigType =
  | Pick<FormActionConfig, 'preLabel' | 'postLabel' | 'preSeverity'>
  | Record<string, string | boolean>;
