import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  BaseDatatableComponent,
  TableService,
} from '@hospitality-bot/admin/shared';
import { LazyLoadEvent } from 'primeng/api';
import { Subscription } from 'rxjs';
import { OutletTableService } from '../../services/outlet-table.service';
import * as FileSaver from 'file-saver';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { cols, status, tabFilterItems } from '../../constants/data-table';

@Component({
  selector: 'hospitality-bot-outlets-data-table',
  templateUrl: './outlets-data-table.component.html',
  styleUrls: [
    './outlets-data-table.component.scss',
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
  ],
})
export class OutletsDataTableComponent extends BaseDatatableComponent
  implements OnInit {
  hotelId: string;
  globalQueries = [];
  $subscription = new Subscription();
  limit = 10;
  offset = 0;
  tabFilterItems = tabFilterItems;
  cols = cols;
  status = status;

  constructor(
    public fb: FormBuilder,
    protected globalFilterService: GlobalFilterService,
    protected tabFilterService: TableService,
    protected outletService: OutletTableService,
    protected adminUtilityService: AdminUtilityService,
    protected snackbarService: SnackBarService
  ) {
    super(fb, tabFilterService);
  }
  ngOnInit(): void {
    this.listenForGlobalFilter();
  }

  listenForGlobalFilter() {
    this.globalFilterService.globalFilter$.subscribe((value) => {
      this.hotelId = this.globalFilterService.hotelId;

      this.globalQueries = [
        ...value['filter'].queryValue,
        ...value['dateRange'].queryValue,
      ];
      this.initTableValue();
    });
  }

  loadData(event: LazyLoadEvent): void {
    this.initTableValue();
  }

  initTableValue(): void {
    this.loading = true;

    this.$subscription.add(
      this.outletService.getOutletList().subscribe(
        (res) => {
          this.values = res;
          // this.totalRecords = 1;
        },
        (err) => {},
        this.handleFinal
      )
    );
  }

  /**
   * To get query params
   */
  getQueryConfig() {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.getSelectedQuickReplyFilters(),
        ...[...this.globalQueries, { order: 'DESC' }],
        {
          limit: this.limit,
          offset: this.offset,
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
        ? { status: null }
        : { status: chips[0].value === 'ACTIVE' },
    ];
  }

  exportCSV(): void {
    this.loading = true;

    const config = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        { order: 'DESC' },
        ...this.selectedRows.map((item) => ({ ids: item.id })),
      ]),
    };

    this.$subscription.add(
      this.outletService.exportCSV(this.hotelId, config).subscribe((res) => {
        FileSaver.saveAs(
          res,
          `${this.tableName.toLowerCase()}_export_${new Date().getTime()}.csv`
        );
      }, this.handleFinal)
    );
  }

  /**
   * @function handleStatus To handle the status change
   * @param status status value
   */
  handleStatus(status, rowData): void {
    // Not working
    this.loading = true;
    this.$subscription.add(
      this.outletService
        .updateOutletItem(this.hotelId, rowData.id, status)
        .subscribe(
          () => {
            this.updateStatusAndCount(rowData.status, status);

            this.snackbarService.openSnackBarAsText(
              'Status changes successfully',
              '',
              { panelClass: 'success' }
            );
          },
          ({ error }) => {},
          this.handleFinal
        )
    );
  }

  handleFinal = () => {
    this.loading = false;
  };
}
