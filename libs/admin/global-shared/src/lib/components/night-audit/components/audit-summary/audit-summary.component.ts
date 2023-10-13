import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActionConfigType } from '../../../../types/night-audit.type';
import { MenuItem } from 'primeng/api';
import { cols, dummyData } from '../../constants/audit-summary.table';
import { NightAuditService } from '../../../../services/night-audit.service';
import { Subscription } from 'rxjs';
import {
  AdminUtilityService,
  QueryConfig,
} from '@hospitality-bot/admin/shared';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { AuditSummary } from '../../models/audit-summary.model';
import { AuditViewType } from '../../types/audit-summary.type';

@Component({
  selector: 'hospitality-bot-audit-summary',
  templateUrl: './audit-summary.component.html',
  styleUrls: [
    '../../night-audit.component.scss',
    './audit-summary.component.scss',
  ],
})
export class AuditSummaryComponent implements OnInit {
  entityId = '';
  title = 'Audit Summary';
  cols = cols;
  values: AuditViewType;
  loading = false;
  isNoAuditFound = false;
  actionConfig: ActionConfigType;
  today = new Date();

  @Input() activeIndex = 0;
  @Input() stepList: MenuItem[];
  @Output() indexChange = new EventEmitter<any>();

  $subscription = new Subscription();

  constructor(
    private nightAuditService: NightAuditService,
    private globalFilterService: GlobalFilterService,
    private adminUtilityService: AdminUtilityService
  ) {}

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.initTable();
    this.initActionConfig();
  }

  initTable() {
    this.loading = true;
    this.$subscription.add(
      this.nightAuditService
        .getAuditSummary(this.entityId, this.getQueryConfig())
        .subscribe(
          (res) => {
            this.values = new AuditSummary().deserialize(res).records;
            this.loading = false;
          },
          (error) => {
            this.loading = false;
            this.isNoAuditFound = true;
          }
        )
    );
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
    this.indexChange.emit(this.activeIndex + 1);
  }

  handlePrev() {
    if (this.activeIndex > 0)
      this.indexChange.emit({ index: this.activeIndex - 1, isPrev: true });
  }

  getQueryConfig(): QueryConfig {
    return {
      params: this.adminUtilityService.makeQueryParams([
        {
          auditDate: new Date().getTime(),
        },
      ]),
    };
  }

  get columns() {
    return Object.keys(this.cols);
  }
}
