import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  AdminUtilityService,
  BaseDatatableComponent,
  ModuleNames,
  NavRouteOption,
  NavRouteOptions,
  TableService,
} from '@hospitality-bot/admin/shared';
import { Subscription } from 'rxjs';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { cols, title } from '../../constant/data-table';
import { AgentService } from '../../services/agent.service';
import { ActivatedRoute, Router } from '@angular/router';
import { agentRoutes } from '../../constant/routes';
import * as FileSaver from 'file-saver';
import { MemberSortTypes, QueryConfig, SortingOrder } from '../../types/agent';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { AgentModel, AgentResponseModel } from '../../models/agent.model';
import { LazyLoadEvent } from 'primeng/api';
import { companyRoutes } from 'libs/admin/company/src/lib/constants/route';
import { SortBy, SortFilterList } from '../../constant/response';
import { AgentListResponse } from '../../types/response';
import { RoutesConfigService } from '@hospitality-bot/admin/core/theme';

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
  readonly routes = { ...agentRoutes, ...companyRoutes };

  entityId: string;
  tableName = title;
  cols = cols;
  searchForm: FormGroup;
  sortFilterList = SortFilterList;
  subscription$ = new Subscription();
  navRoutes: NavRouteOption[] = [
    {
      label: 'Members',
      link: './'
    },
  ];

  constructor(
    public fb: FormBuilder,
    protected tabFilterService: TableService,
    private globalFilterService: GlobalFilterService,
    private agentService: AgentService,
    private adminUtilityService: AdminUtilityService,
    private snackbarService: SnackBarService,
    private router: Router,
    private route: ActivatedRoute,
    private routesConfigService: RoutesConfigService
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
      this.agentService
        .getAgentList(this.getQueryConfig(SortBy[this.sortedBy]))
        .subscribe(
          (res) => {
            this.mapData(res);
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

  sortBy(key: MemberSortTypes) {
    this.sortedBy = key;
    if (this.searchKey) {
      this.searchAgent(this.searchKey);
      return;
    }
    this.loading = true;
    this.subscription$.add(
      this.agentService
        .sortMemberBy(this.getQueryConfig(SortBy[key]))
        .subscribe(
          (res) => {
            this.mapData(res);
            this.loading = false;
          },
          (error) => {
            this.loading = false;
          },
          this.handleFinal
        )
    );
  }

  mapData(res: AgentListResponse) {
    const agentList = new AgentResponseModel().deserialize(res);
    this.values = agentList.records;
    this.initFilters(
      agentList.entityStateCounts,
      agentList.entityTypeCounts,
      agentList.totalRecord
    );
  }

  searchAgent(key: string) {
    if (!key.length) {
      this.searchKey = null;
      this.initTable();
      return;
    }
    this.searchKey = key;
    this.loading = true;
    this.agentService
      .searchAgent({
        params: this.adminUtilityService.makeQueryParams([
          {
            key: key,
            type: 'AGENT',
            ...SortBy[this.sortedBy],
          },
        ]),
      })
      .subscribe((res) => {
        this.values =
          res.map((item) => new AgentModel().deserialize(item)) ?? [];
        this.loading = false;
      });
  }

  /**
   * @function editAgent To edit the agent.
   * @params rowData
   */
  editAgent(rowData) {
    this.routesConfigService.navigate({
      additionalPath: `${this.routes.editAgent.route}/${rowData.id}`,
    });
  }

  openCompany(rowData) {
    this.routesConfigService.navigate({
      subModuleName: ModuleNames.COMPANY,
      additionalPath: `${this.routes.editCompany.route}/${rowData.companyId}`,
    });
  }

  /**
   * @function handleStatus To handle the status change
   * @param status status value
   */
  handleStatus(status, rowData): void {
    this.loading = true;
    this.subscription$.add(
      this.agentService
        .updateAgentStatus(
          { agentId: rowData.id, status: status },
          {
            params: `?type=AGENT`,
          }
        )
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

  getQueryConfig(sortBy?: SortingOrder): QueryConfig {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.getSelectedQuickReplyFilters({ key: 'entityState' }),
        {
          type: 'AGENT',
          entityId: this.entityId,
          order: 'DESC',
          sort: 'created',
          offset: this.first,
          limit: this.rowsPerPage,
          ...sortBy,
        },
      ]),
    };
    return config;
  }

  handleFinal = () => {
    this.loading = false;
  };

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
