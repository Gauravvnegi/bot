import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { QueryConfig } from '@hospitality-bot/admin/library';
import {
  BaseDatatableComponent,
  AdminUtilityService,
  TableService,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import {
  filters,
  TableValue,
  cols,
  transactionChips,
} from '../../constants/data-table';
import { LazyLoadEvent } from 'primeng/api';
import * as FileSaver from 'file-saver';
import { FinanceService } from '../../services/finance.service';
import { TransactionHistory } from '../../models/history.model';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'hospitality-bot-transaction-history-data-table',
  templateUrl: './transaction-history-data-table.component.html',
  styleUrls: [
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './transaction-history-data-table.component.scss',
  ],
})
export class TransactionHistoryDataTableComponent extends BaseDatatableComponent
  implements OnInit {
  tabFilterItems = filters;
  selectedTable: TableValue;
  tableName = 'Transaction History';
  filterChips = transactionChips;
  cols = cols.transaction;
  isQuickFilters = true;

  hotelId: string;

  $subscription = new Subscription();

  constructor(
    public fb: FormBuilder,
    protected tabFilterService: TableService,
    private adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    protected snackbarService: SnackBarService, // private router: Router, // private modalService: ModalService
    private router: Router,
    private financeService: FinanceService
  ) {
    super(fb, tabFilterService);
  }

  ngOnInit(): void {
    this.hotelId = this.globalFilterService.hotelId;
    this.listenToTableChange();
  }

  /**
   * @function listenToTableChange  To listen to table changes
   */
  listenToTableChange() {
    this.financeService.selectedTable.subscribe((value) => {
      this.selectedTable = value;
      this.initTableValue();
    });
  }

  loadData(event: LazyLoadEvent): void {
    this.initTableValue();
  }

  initTableValue() {
    this.loading = true;

    this.financeService.getTransactionHistory(this.hotelId).subscribe(
      (res) => {
        const transactionHistory = new TransactionHistory().deserialize(res);
        this.values = res;
        this.updateTabFilterCount(res.entityTypeCounts, res.total);
        this.updateQuickReplyFilterCount(res.entityStateCounts);
        this.updateTotalRecords();
      },
      () => {
        this.values = [];
        this.loading = false;
      },
      this.handleFinal
    );
  }

  getQueryConfig(): QueryConfig {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.getSelectedQuickReplyFilters(),
        {
          tableType: this.selectedTable,
          offset: this.first,
          limit: this.rowsPerPage,
        },
      ]),
    };
    return config;
  }

  onSelectedTabFilterChange(event: MatTabChangeEvent): void {
    this.financeService.selectedTransactionTable.next(
      this.tabFilterItems[event.index].value
    );
    this.tabFilterIdx = event.index;
    this.initTableValue();
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
        : { status: chips[0].value === 'PAID' },
    ];
  }

  /**
   * @function exportCSV To export CSV report of the table.
   */
  exportCSV(): void {
    this.loading = true;

    // const config: QueryConfig = {
    //   params: this.adminUtilityService.makeQueryParams([
    //     ...this.selectedRows.map((item) => ({ ids: item.id })),
    //
    //   ]),
    // };
    this.$subscription.add(
      this.financeService.exportCSV(this.hotelId).subscribe(
        (res) => {
          FileSaver.saveAs(
            res,
            `${this.tableName.toLowerCase()}_export_${new Date().getTime()}.csv`
          );
        },
        () => {},
        this.handleFinal
      )
    );
  }

  /**
   * @function handleError to show the error
   * @param param0 network error
   */
  handleError = ({ error }): void => {
    this.loading = false;
  };

  handleFinal = () => {
    this.loading = false;
  };
}
