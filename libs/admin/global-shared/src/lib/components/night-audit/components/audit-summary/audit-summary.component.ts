import { DialogService } from 'primeng/dynamicdialog';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  QueryConfig,
  openModal,
} from '@hospitality-bot/admin/shared';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { NightAuditService } from '../../../../services/night-audit.service';
import { ActionConfigType } from '../../../../types/night-audit.type';
import { cols } from '../../constants/audit-summary.table';
import { AuditSummary } from '../../models/audit-summary.model';
import { AuditViewType } from '../../types/audit-summary.type';
import { ModalComponent } from 'libs/admin/shared/src/lib/components/modal/modal.component';

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
  cols = { ...cols };
  values: AuditViewType | {};
  loading = true;
  isNoAuditFound = true;
  actionConfig: ActionConfigType;
  lastNightDate = new Date();
  auditDate: Date;
  auditDates: number[] = [];

  @Input() activeIndex = 0;
  @Input() stepList: MenuItem[];
  @Output() indexChange = new EventEmitter<any>();
  @Output() auditDateChange = new EventEmitter<Date>();

  $subscription = new Subscription();

  constructor(
    private nightAuditService: NightAuditService,
    private globalFilterService: GlobalFilterService,
    private adminUtilityService: AdminUtilityService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.nightAuditService.$moveBackStateDisable.next(true);
    this.entityId = this.globalFilterService.entityId;
    this.initAuditTime();
    this.checkAudit();
    this.initActionConfig();
  }

  initAuditTime() {
    this.lastNightDate.setDate(this.lastNightDate.getDate() - 1);
    this.lastNightDate.setHours(23, 59, 59);
  }

  // TODO: Need to do common with night audit
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
            // inform to everywhere is any audit exist or not
            this.nightAuditService.remainingAudit.next(res?.length ? res : []);

            const loadTable = () => {
              this.auditDates = res;
              const currentAuditDate = this.auditDates.shift();
              this.auditDate = new Date(currentAuditDate);
              this.auditDateChange.emit(this.auditDate);
              this.initTable();
            };

            const doNotLoad = () => {
              this.values = {};
              this.loading = false;
              this.isNoAuditFound = true;
            };
            if (res?.length) {
              if (isNext) {
                const content: Partial<ModalComponent> = {
                  heading: 'Audit Summary',
                  descriptions: [
                    `There are ${res.length} more audit, do you want to continue ?`,
                  ],
                };
                const actions = [
                  {
                    label: 'No',
                    onClick: () => {
                      doNotLoad();
                      this.indexChange.emit(this.activeIndex + 1);
                      dialogRef.close();
                    },
                    variant: 'outlined',
                  },
                  {
                    label: 'Yes',
                    onClick: () => {
                      this.indexChange.emit({ index: 0 });
                      dialogRef.close({ index: 0 });
                    },
                    variant: 'contained',
                  },
                ];
                const dialogRef = openModal({
                  component: ModalComponent,
                  config: {
                    styleClass: 'confirm-dialog',
                    width: 'unset',
                    data: {
                      content: content,
                      actions: actions,
                    },
                  },
                  dialogService: this.dialogService,
                });
                dialogRef.onClose.subscribe((res) => {
                  const index = res ? res : this.activeIndex + 1
                  this.indexChange.emit(index);
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
            this.isNoAuditFound = true;
            this.auditDates = [];
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
            const auditSummary = new AuditSummary().deserialize(res);
            this.cols = { ...cols };
            Object.keys(auditSummary.columns).forEach((col) => {
              if (this.cols[col]) {
                this.cols[col] = [
                  ...this.cols[col],
                  ...auditSummary.columns[col],
                ];
              }
            });
            this.values = auditSummary.records;
            this.isNoAuditFound = false;
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
      preHide: this.activeIndex == 0 || this.activeIndex === 3,
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
