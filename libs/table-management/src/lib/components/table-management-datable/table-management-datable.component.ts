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
} from '../../types/table-datable.type';
import {
  TableValue,
  tableManagementConfig,
  tabFilterItems,
} from '../../constants/table-datable';
import {
  tableManagementParmId,
  tableManagementRoutes,
} from '../../constants/routes';
import { ActivatedRoute, Router } from '@angular/router';
import { TableManagementService } from '../../services/table-management.service';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { AreaList, TableList } from '../../models/data-table.model';
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
  navRoutes: NavRouteOption[] = [];
  entityId: string;

  tableName: string = 'Table';
  selectedTab: TableManagementDatableTabs = TableValue.table;
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
    this.initTableValue();
  }

  loadData(event: LazyLoadEvent): void {
    this.selectedTab = this.tabFilterItems[this.tabFilterIdx].value;
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
              case TableValue.table:
                const tableList = new TableList().deserialize(
                  res as TableListResponse
                );
                this.values = tableList.records ?? [];
                this.initFilters(
                  tableList.entityTypeCounts,
                  tableList.entityStateCounts,
                  tableList.totalRecord
                );
                break;

              case TableValue.area:
                const areaList = new AreaList().deserialize(
                  res as AreaListResponse
                );
                this.values = areaList.records ?? [];
                this.initFilters(
                  areaList.entityTypeCounts,
                  areaList.entityStateCounts,
                  areaList.totalRecord
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

  getQueryConfig(): QueryConfig {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.getSelectedQuickReplyFilters({
          key: 'inventoryTypeStatus', //it will changed to inventoryTypeStatus
        }),
        {
          type: this.selectedTab,
          offset: this.first,
          limit: this.rowsPerPage,
          sort: 'updated',
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
      case TableValue.table:
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
      case TableValue.area:
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
