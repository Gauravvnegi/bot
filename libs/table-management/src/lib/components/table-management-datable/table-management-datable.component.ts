import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import {
  BaseDatatableComponent,
  NavRouteOption,
} from '@hospitality-bot/admin/shared';
import { TableManagementDatableTabs } from '../../types/table-datable.type';
import {
  TableValue,
  tableManagementConfig,
  tabFilterItems,
} from '../../constants/table-datable';
import { tableManagementRoutes } from '../../constants/routes';
import { ActivatedRoute, Router } from '@angular/router';

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

  tableName: string = 'Table';
  selectedTab: TableManagementDatableTabs = TableValue.table;
  tabFilterItems = tabFilterItems;

  constructor(
    _fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super(_fb);
  }

  ngOnInit(): void {}

  onSelectedTabFilterChange(event: MatTabChangeEvent) {
    this.tabFilterIdx = event.index;
    this.selectedTab = this.tabFilterItems[event.index].value;
  }

  getEmptyMessageContent(tabName: TableManagementDatableTabs) {
    return this.tableManagementConfig[tabName].emptyTableMessage;
  }

  navigateToAddMultipleTable() {
    this.router.navigate([tableManagementRoutes.createMultipleTable.route], {
      queryParams: { type: 'MULTIPLE' },
      relativeTo: this.route,
    });
  }
}
