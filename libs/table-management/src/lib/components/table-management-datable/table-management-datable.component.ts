import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import {
  AdminUtilityService,
  BaseDatatableComponent,
  NavRouteOption,
  QueryConfig,
} from '@hospitality-bot/admin/shared';
import {
  AreaListResponse,
  TableListResponse,
  TableManagementDatableTabs,
  TableStatus,
} from '../../types/table-datable.type';
import {
  TableValue,
  tableManagementConfig,
  tabFilterItems,
  tableStatusDetails,
  title,
} from '../../constants/table-datable';
import {
  tableManagementParmId,
  tableManagementRoutes,
} from '../../constants/routes';
import { ActivatedRoute, Router } from '@angular/router';
import { TableManagementService } from '../../services/table-management.service';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AreaData,
  AreaList,
  TableData,
  TableList,
} from '../../models/data-table.model';
import { LazyLoadEvent } from 'primeng/api';

@Component({
  selector: 'hospitality-bot-table-management-datable',
  templateUrl: './table-management-datable.component.html',
  styleUrls: [
    './table-management-datable.component.scss',
    '../../../../../admin/shared/src/lib/components/datatable/datatable.component.scss',
  ],
})
export class TableManagementDatableComponent extends BaseDatatableComponent
  implements OnInit {
  readonly tableManagementConfig = tableManagementConfig;
  readonly TableValue = TableValue;
  readonly tableManagementRoutes = tableManagementRoutes;
  readonly tableStatusDetails = tableStatusDetails;
  navRoutes: NavRouteOption[] = [];
  entityId: string;

  tableName: string = 'Table';
  selectedTab: TableManagementDatableTabs = TableValue.Table;
  tabFilterItems = tabFilterItems;

  constructor(
    _fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private adminUtilityService: AdminUtilityService,
    private tableManagementService: TableManagementService,
    private globalFilterService: GlobalFilterService
  ) {
    super(_fb);
  }

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    if (this.tableManagementService.selectedTab.value) {
      this.selectedTab = this.tableManagementService.selectedTab.value;
      this.selectedTab === TableValue.Table
        ? (this.tabFilterIdx = 0)
        : (this.tabFilterIdx = 1);
    }
    this.tableName = title[this.selectedTab];
    this.listenGlobalFilterChange();
  }

  listenGlobalFilterChange() {
    this.subscriptionList$.add(
      this.tableManagementService.onGlobalFilterChange.subscribe((res) => {
        this.entityId = res.entityId[0];
        this.tableManagementService.entityId = this.entityId;
        this.initTableValue();
      })
    );
  }

  loadData(event: LazyLoadEvent): void {
    this.selectedTab = this.tabFilterItems[this.tabFilterIdx].value;
    this.tableManagementService.selectedTab.next(this.selectedTab);
    this.tableName = title[this.selectedTab];
    this.initTableValue();
  }

  initTableValue(): void {
    this.loading = true;

    this.subscriptionList$.add(
      this.tableManagementService
        .getList<TableListResponse | AreaListResponse>(
          this.entityId,
          this.getQueryConfig()
        )
        .subscribe(
          (res) => {
            switch (this.selectedTab) {
              case TableValue.Table:
                const tableList = new TableList().deserialize(
                  res as TableListResponse
                );
                this.values = tableList.records ?? [];
                this.initFilters(
                  tableList.entityTypeCounts,
                  tableList.entityStateCounts,
                  tableList.totalRecord,
                  tableStatusDetails
                );
                break;

              case TableValue.Area:
                const areaList = new AreaList().deserialize(
                  res as AreaListResponse
                );
                this.values = areaList.records ?? [];
                this.initFilters(
                  areaList.entityTypeCounts,
                  areaList.entityStateCounts,
                  areaList.totalRecord,
                  tableStatusDetails
                );
            }

            this.loading = false;
          },
          () => {
            this.loading = false;
          }
        )
    );
  }

  handleStatus(
    status: TableStatus | boolean,
    rowData: TableData | AreaData
  ): void {
    switch (this.selectedTab) {
      case TableValue.Table:
        this.handelTableStatus(status as TableStatus, rowData as TableData);

      case TableValue.Area:
        this.handleAreaStatus(status as boolean, rowData as AreaData);
    }
  }

  handelTableStatus(status: TableStatus, data: TableData): void {
    this.subscriptionList$.add(
      this.tableManagementService
        .updateTable(this.entityId, {
          table: {
            id: data.id,
            status: status,
          },
        })
        .subscribe(
          () => this.initTableValue(),
          () => {
            this.loading = false;
          }
        )
    );
  }

  handleAreaStatus(status: boolean, data: AreaData): void {
    this.loading = true;
    this.subscriptionList$.add(
      this.tableManagementService
        .updateArea(this.entityId, {
          area: {
            id: data.id,
            status: status,
          },
        })
        .subscribe(
          () => this.initTableValue(),
          () => {
            this.loading = false;
          }
        )
    );
  }

  getQueryConfig(): QueryConfig {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.getSelectedQuickReplyFilters({
          isStatusBoolean: this.selectedTab === TableValue.Area,
          key:
            this.selectedTab === TableValue.Area
              ? tableManagementConfig.AREA.entityStateKey
              : tableManagementConfig.TABLE.entityStateKey,
        }),
        {
          type: this.selectedTab,
          offset: this.first,
          limit: this.rowsPerPage,
          sort: 'updated',
          raw: 'true',
        },
      ]),
    };
    return config;
  }

  getEmptyMessageContent(tabName: TableManagementDatableTabs) {
    return this.tableManagementConfig[tabName].emptyTableMessage;
  }

  getColumns() {
    return this.tableManagementConfig[this.selectedTab].cols;
  }

  navigateToAddMultipleTable() {
    this.router.navigate([tableManagementRoutes.createMultipleTable.route], {
      queryParams: { type: 'MULTIPLE' },
      relativeTo: this.route,
    });
  }

  openEditForm(data) {
    switch (this.selectedTab) {
      case TableValue.Table:
        this.router.navigate(
          [
            tableManagementRoutes.editable.route.replace(
              `:${tableManagementParmId.TABLE}`,
              data?.id
            ),
          ],
          {
            relativeTo: this.route,
          }
        );
        break;
      case TableValue.Area:
        this.router.navigate(
          [
            tableManagementRoutes.editArea.route.replace(
              `:${tableManagementParmId.AREA}`,
              data?.id
            ),
          ],
          {
            relativeTo: this.route,
          }
        );
    }
  }

  /**
   * @function handleError to show the error
   * @param param0
   */
  handleError = ({ error }): void => {
    this.loading = false;
  };

  /**
   * @function ngOnDestroy unsubscribe subscription
   */
  ngOnDestroy(): void {
    this.subscriptionList$.unsubscribe();
  }
}
