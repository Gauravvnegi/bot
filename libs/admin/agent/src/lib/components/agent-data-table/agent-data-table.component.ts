import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
  AdminUtilityService,
  BaseDatatableComponent,
  TableService,
} from '@hospitality-bot/admin/shared';
import { Subscription } from 'rxjs';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { cols, title } from '../../constant/data-table';
import { AgentService } from '../../services/agent.service';
import { Router } from '@angular/router';
import { agentRoutes } from '../../constant/routes';
import * as FileSaver from 'file-saver';
import { QueryConfig } from '../../types/agent';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { AgentResponseModel } from '../../models/agent.model';
import { LazyLoadEvent } from 'primeng/api';

@Component({
  selector: 'hospitality-bot-agent-data-table',
  templateUrl: './agent-data-table.component.html',
  styleUrls: [
    './agent-data-table.component.scss',
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
  ],
})
export class AgentDataTableComponent extends BaseDatatableComponent
  implements OnInit, OnDestroy {
  readonly routes = agentRoutes;

  entityId: string;

  tableName = title;
  cols = cols;

  subscription$ = new Subscription();

  constructor(
    public fb: FormBuilder,
    protected tabFilterService: TableService,
    private globalFilterService: GlobalFilterService,
    private agentService: AgentService,
    private adminUtilityService: AdminUtilityService,
    private snackbarService: SnackBarService,
    private router: Router
  ) {
    super(fb, tabFilterService);
  }

  /**
   * @function loadData Fetch data as paginates
   * @param event
   */
  loadData(event: LazyLoadEvent): void {
    this.initTable();
  }

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.initTable();
  }

  initTable() {
    this.loading = true;
    this.subscription$.add(
      this.agentService.getAgentList(this.getQueryConfig()).subscribe(
        (res) => {
          const agentList = new AgentResponseModel().deserialize(res);
          this.values = agentList.records;
          this.initFilters(
            agentList.entityStateCounts,
            agentList.entityTypeCounts,
            agentList.totalRecord
          );
          this.loading = false;
        },
        (error) => {
          this.values = [];
          this.loading = false;
        },
        this.handleFinal
      )
    );
  }

  getQueryConfig(): QueryConfig {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.getSelectedQuickReplyFiltersV2({ isStatusBoolean: true }),
        {
          type: 'AGENT',
          entityId: this.entityId,
          offset: this.first,
          limit: this.rowsPerPage,
        },
      ]),
    };
    return config;
  }

  /**
   * @function handleStatus To handle the status change
   * @param status status value
   */
  handleStatus(status, rowData): void {
    this.loading = true;
    this.subscription$.add(
      this.agentService
        .updateAgentStatus(rowData.id, {
          params: `?status=${status}&type=AGENT`,
        })
        .subscribe(
          () => {
            this.initTable();
            this.snackbarService.openSnackBarAsText(
              'Status changes successfully',
              '',
              { panelClass: 'success' }
            );
          },
          () => {
            this.loading = false;
          },
          this.handleFinal
        )
    );
  }

  /**
   * @function editAgent To edit the agent.
   * @params rowData
   */
  editAgent(rowData) {
    this.router.navigate([
      `/pages/members/agent/${this.routes.editAgent.route}/${rowData.id}`,
    ]);
  }

  /**
   * @function exportCSV To export CSV report of the table.
   */
  exportCSV(): void {
    this.loading = true;
    const config: QueryConfig = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.selectedRows.map((item) => ({ ids: item.id })),
        {
          type: 'AGENT',
          entityId: this.entityId,
          entityState: this.selectedTab,
        },
      ]),
    };
    this.subscription$.add(
      this.agentService.exportCSV(config).subscribe(
        (res) => {
          FileSaver.saveAs(
            res,
            `${this.tableName.toLowerCase()}_export_${new Date().getTime()}.csv`
          );
          this.loading = false;
        },
        (error) => {
          this.loading = false;
        },
        this.handleFinal
      )
    );
  }

  handleFinal = () => {
    this.loading = false;
  };

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
