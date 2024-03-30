import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  BaseDatatableComponent,
  QueryConfig,
} from '@hospitality-bot/admin/shared';
import { Subscription } from 'rxjs';
import { OutletService } from '../../services/outlet.service';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { cols } from '../../constants/data-table';
import { ActivatedRoute, Router } from '@angular/router';
import { outletBusinessRoutes } from '../../constants/routes';
import { MenuItemList } from '../../models/outlet.model';
import { LazyLoadEvent } from 'primeng/api';
import { MenuItemResponse } from '../../types/outlet';

@Component({
  selector: 'hospitality-bot-menu-data-table',
  templateUrl: './menu-data-table.component.html',
  styleUrls: [
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './menu-data-table.component.scss',
  ],
})
export class MenuDataTableComponent extends BaseDatatableComponent
  implements OnInit {
  tableName = 'Menu Items';
  cols = cols['MENU'];
  $subscription = new Subscription();
  navigationRoute = outletBusinessRoutes;
  globalQueries = [];
  @Input() menuId: string;
  @Input() outletId: string;

  constructor(
    public fb: FormBuilder,
    protected globalFilterService: GlobalFilterService,
    protected outletService: OutletService,
    protected adminUtilityService: AdminUtilityService,
    protected snackbarService: SnackBarService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super(fb);
  }

  ngOnInit(): void {
    this.listenForGlobalFilters();
  }

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
    this.globalFilterService.globalFilter$.subscribe((data) => {
      // set-global query everytime global filter changes
      this.globalQueries = [
        ...data['filter'].queryValue,
        ...data['dateRange'].queryValue,
      ];
      this.initTableValue();
    });
  }

  loadData(event: LazyLoadEvent): void {
    this.initTableValue();
  }

  initTableValue(): void {
    this.loading = true;
    this.outletService
      .getMenuItems(this.getQueryConfig(), this.outletId)
      .subscribe(
        (res) => {
          const menuItem = new MenuItemList().deserialize(res);
          this.values = menuItem.records;
          this.initFilters(
            menuItem.entityTypeCounts,
            menuItem.entityStateCounts,
            menuItem.total
          );
          this.loading = false;
        },
        ({ error }) => {
          this.handleError(error);
        },
        this.handleFinal
      );
  }

  getQueryConfig(): QueryConfig {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.getSelectedQuickReplyFilters({ key: 'entityState' }),
        ...this.globalQueries,
        {
          offset: this.first,
          limit: this.rowsPerPage,
          menuId: this.menuId,
        },
      ]),
    };
    return config;
  }

  /**
   * @function handleStatus To handle the status change
   * @param status status value
   */
  handleStatus(status: boolean, rowData: MenuItemResponse): void {
    this.loading = true;
    this.$subscription.add(
      this.outletService
        .updateMenuItems({ status: status }, rowData.id, this.menuId)
        .subscribe(() => {
          this.initTableValue();
          this.snackbarService.openSnackBarAsText(
            'Status changed successfully',
            '',
            { panelClass: 'success' }
          );
          this.loading = false;
        }, this.handleFinal)
    );
  }

  addMenuItems() {
    this.router.navigate([], {
      relativeTo: this.route,
    });
  }

  editMenuItem(rowData: MenuItemResponse) {
    this.router.navigate([`menu-item/${rowData.id}`], {
      relativeTo: this.route,
    });
  }

  handleImport() {}

  /**
   * @function handleError to show the error
   * @param param0 network error
   */
  handleError = ({ error }): void => {
    this.values = [];
    this.loading = false;
  };

  handleFinal = () => {
    this.loading = false;
  };
}
