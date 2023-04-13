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
import { cols, title, filtersChips } from '../../constants/data-table';
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
  hotelId: string;
  tableName = title;
  cols = cols;
  isCustomSort = true;
  triggerInitialData = false;
  filterChips = filtersChips;
  tabFilterIdx = 1;
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
    this.navRoutes = navRoutes;
  }

  ngOnInit(): void {
    this.hotelId = this.globalFilterService.hotelId;
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
      this.taxService.getTaxList(this.hotelId, this.getQueryConfig()).subscribe(
        (res) => {
          const taxList = new TaxList().deserialize(res);

          this.values = taxList.records;

          this.totalRecords = taxList.total;

          this.filterChips.forEach((item) => {
            item.total = taxList.entityStateCounts[item.value];
          });
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
        ...this.getSelectedQuickReplyFilters(),
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
   * @function getSelectedQuickReplyFilters To return the selected chip list.
   * @returns The selected chips.
   */
  getSelectedQuickReplyFilters() {
    const chips = this.filterChips.filter(
      (item) => item.isSelected && item.value !== 'ALL'
    );
    return [
      chips.length !== 1
        ? { entityState: null }
        : { entityState: chips[0].value === 'ACTIVE' },
    ];
  }

  /**
   * @function handleStatus
   * @description To handle status Active/Inactive
   */

  handleStatus(status: boolean, rowData): void {
    this.loading = true;
    this.taxService
      .updateTax(this.hotelId, rowData.id, { status: status })
      .subscribe(
        (res) => {
          const statusValue = (val: boolean) => (val ? 'ACTIVE' : 'INACTIVE');
          this.updateStatusAndCount(
            statusValue(rowData.status),
            statusValue(status)
          );
          this.values.find((item) => item.id === rowData.id).status = status;
          this.snackbarService.openSnackBarAsText(
            'Status changes successfully',
            '',
            { panelClass: 'success' }
          );
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
      this.taxService.exportCSV(this.hotelId, config).subscribe(
        (res) => {
          FileSaver.saveAs(
            res,
            `${this.tableName.toLowerCase()}_export_${new Date().getTime()}.csv`
          );
        }, 
        this.handleFinal
      )
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
