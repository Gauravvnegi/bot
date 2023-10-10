import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActionConfigType } from '../../../../types/night-audit.type';
import { MenuItem } from 'primeng/api';
import { cols, dummyData } from '../../constants/audit-summary.table';

@Component({
  selector: 'hospitality-bot-audit-summary',
  templateUrl: './audit-summary.component.html',
  styleUrls: [
    '../../night-audit.component.scss',
    './audit-summary.component.scss',
  ],
})
export class AuditSummaryComponent implements OnInit {
  title = 'Audit Summary';
  cols = cols;
  values = dummyData;
  loading = false;
  actionConfig: ActionConfigType;
  today = new Date();

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
    this.values = dummyData;
    this.loading = false;
  }

  initActionConfig(postLabel?: string) {
    this.actionConfig = {
      preHide: this.activeIndex == 0,
      preLabel: this.activeIndex != 0 ? 'Back' : undefined,
      postLabel:
        this.activeIndex == this.stepList.length - 1 ? 'Finish' : 'Next',
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

  get columns() {
    return Object.keys(this.cols);
  }
}
