import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AdminUtilityService,
  BaseDatatableComponent,
  NavRouteOptions,
} from '@hospitality-bot/admin/shared';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { TableService } from 'libs/admin/shared/src/lib/services/table.service';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { taxRoutes } from '../../constants/routes';
import { cols, title } from '../../constants/data-table';
import { Subscription } from 'rxjs';
import { TaxService } from '../../services/tax.service';
import { LazyLoadEvent } from 'primeng/api/public_api';
import { TaxList } from '../../models/tax.model';
import { QueryConfig } from '../../types/tax';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'hospitality-bot-tax-data-table',
  templateUrl: './tax-data-table.component.html',
  styleUrls: [
    './tax-data-table.component.scss',
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
  ],
})
export class TaxDataTableComponent extends BaseDatatableComponent
  implements OnInit, OnDestroy {
  readonly routes = taxRoutes;
  entityId: string;
  tableName = title;
  cols = cols;
  isCustomSort = true;
  triggerInitialData = false;
  isAllTabFilterRequired = true;
  globalQueries = [];
  $subscription = new Subscription();
  navRoutes: NavRouteOptions;

  constructor(
    public fb: FormBuilder,
    private globalFilterService: GlobalFilterService,
    private snackbarService: SnackBarService,
    private adminUtilityService: AdminUtilityService,
    private taxService: TaxService,
    private router: Router,
    protected tabFilterService: TableService
  ) {
    super(fb, tabFilterService);
    const { navRoutes } = taxRoutes['tax'];
    navRoutes[1].isDisabled = true;
    this.navRoutes = navRoutes;
  }

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.initTableValue();
  }

  /**
   * @function loadData Fetch data as paginates
   * @param event
   */
  loadData(event: LazyLoadEvent): void {
    this.initTableValue();
  }

  /**
   * @function initTableValue
   * @description To get table data
   */

  initTableValue(): void {
    this.loading = true;
    this.$subscription.add(
      this.taxService.getTaxList(this.entityId, this.getQueryConfig()).subscribe(
        (res) => {
          const taxList = new TaxList().deserialize(res);

          this.values = taxList.records;
          this.initFilters(
            taxList.entityTypeCounts,
            taxList.entityStateCounts,
            taxList.total
          );
        },
        ({ error }) => {
          this.values = [];
          this.loading = false;
        },
        this.handleFinal
      )
    );
  }

  /**
   * To get query params
   */
  getQueryConfig(): QueryConfig {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.getSelectedQuickReplyFiltersV2({ isStatusBoolean: true }),
        ...[...this.globalQueries, { order: 'DESC' }],
        {
          offset: this.first,
          limit: this.rowsPerPage,
        },
      ]),
    };

    return config;
  }

  /**
   * @function handleStatus
   * @description To handle status Active/Inactive
   */

  handleStatus(status: boolean, rowData): void {
    this.loading = true;
    this.taxService
      .updateTax(this.entityId, rowData.id, { status: status })
      .subscribe(
        (res) => {
          this.initTableValue();
          this.snackbarService.openSnackBarAsText(
            'Status changes successfully',
            '',
            { panelClass: 'success' }
          );
        },
        ({ error }) => {
          this.loading = false;
          this.values = [];
        },
        this.handleFinal
      );
  }

  /**
   * @function exportCSV
   * @description To export the data
   */
  exportCSV(): void {
    this.loading = true;

    const config: QueryConfig = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        { order: 'DESC' },
        ...this.selectedRows.map((item) => ({ ids: item.id })),
      ]),
    };

    this.$subscription.add(
      this.taxService.exportCSV(this.entityId, config).subscribe((res) => {
        FileSaver.saveAs(
          res,
          `${this.tableName.toLowerCase()}_export_${new Date().getTime()}.csv`
        );
      }, this.handleFinal)
    );
  }

  /**
   * @function editTax
   * @description To edit the tax
   */

  editTax(id: string): void {
    this.router.navigate([
      `/pages/settings/tax/${this.routes.createTax.route}/${id}`,
    ]);
  }

  /**
   *  @function handleFinal
   * @description To handle the loading status
   */
  handleFinal = () => {
    this.loading = false;
  };

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
