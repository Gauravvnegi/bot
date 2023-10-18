import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActionConfigType } from '../../../../types/night-audit.type';
import { ConfirmationService, MenuItem } from 'primeng/api';
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
  providers: [ConfirmationService],
})
export class AuditSummaryComponent implements OnInit {
  entityId = '';
  title = 'Audit Summary';
  cols = cols;
  values: AuditViewType;
  loading = false;
  isNoAuditFound = false;
  actionConfig: ActionConfigType;
  lastNightDate = new Date();
  auditDate: Date;
  auditDates: number[] = [];

  @Input() activeIndex = 0;
  @Input() stepList: MenuItem[];
  @Output() indexChange = new EventEmitter<any>();

  $subscription = new Subscription();

  constructor(
    private nightAuditService: NightAuditService,
    private globalFilterService: GlobalFilterService,
    private adminUtilityService: AdminUtilityService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.initAuditTime();
    this.checkAudit();
    this.initActionConfig();
  }

  initAuditTime() {
    this.lastNightDate.setDate(this.lastNightDate.getDate() - 1);
    this.lastNightDate.setHours(23, 59, 59);
  }

  checkAudit(isNext?: boolean) {
    this.loading = true;
    this.$subscription.add(
      this.nightAuditService
        .checkAudit(
          this.entityId,
          this.getQueryConfig({ toDate: this.lastNightDate.getTime() })
        )
        .subscribe(
          (res) => {
            const loadTable = () => {
              this.auditDates = res;
              const currentAuditDate = this.auditDates.shift();
              this.auditDate = new Date(currentAuditDate);
              this.initTable();
            };

            const doNotLoad = () => {
              this.values = {};
              this.loading = false;
              this.isNoAuditFound = false;
            };

            if (res?.length) {
              if (isNext) {
                this.confirmationService.confirm({
                  header: `Audit Summary`,
                  message: `There are ${res.length} more audit, do you want to continue ?`,
                  acceptButtonStyleClass: 'accept-button',
                  rejectButtonStyleClass: 'reject-button-outlined',
                  accept: () => {
                    loadTable();
                  },
                  reject: () => {
                    doNotLoad();
                    this.indexChange.emit(this.activeIndex + 1);
                  },
                });
              } else {
                loadTable();
              }
            } else {
              doNotLoad();
              if (isNext) this.indexChange.emit(this.activeIndex + 1);
            }
          },
          (error) => {
            this.loading = false;
            this.isNoAuditFound = false;
            this.auditDates = [];
          },
          () => {
            this.loading = false;
          }
        )
    );
  }

  initTable() {
    this.loading = true;
    this.$subscription.add(
      this.nightAuditService
        .getAuditSummary(
          this.entityId,
          this.getQueryConfig({ auditDate: this.auditDate.getTime() })
        )
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
      postLabel: 'Finish',
      preSeverity: 'primary',
    };
  }

  handleNext() {
    this.checkAudit(true);
  }

  handlePrev() {
    if (this.activeIndex > 0)
      this.indexChange.emit({ index: this.activeIndex - 1, isPrev: true });
  }

  getQueryConfig(data: { auditDate?: number; toDate?: number }): QueryConfig {
    return {
      params: this.adminUtilityService.makeQueryParams([
        {
          ...data,
        },
      ]),
    };
  }

  get columns() {
    return Object.keys(this.cols);
  }
}
