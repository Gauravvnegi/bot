import { Component, OnInit } from '@angular/core';
import { cols, filters, TableValue, title } from '../../constants/data-table';
import { Subscription } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  BaseDatatableComponent,
  TableService,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { FinanceService } from '../../services/finance.service';
import { QueryConfig } from '@hospitality-bot/admin/library';
import { InvoiceHistoryList } from '../../models/history.model';
import { LazyLoadEvent } from 'primeng/api';

@Component({
  selector: 'hospitality-bot-invoice-history-data-table',
  templateUrl: './invoice-history-data-table.component.html',
  styleUrls: [
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './invoice-history-data-table.component.scss',
  ],
})
export class InvoiceHistoryDataTableComponent extends BaseDatatableComponent
  implements OnInit {
  tableName = title;
  cols = cols.invoice;
  isQuickFilters = true;
  hotelId: string;
  globalQueries = [];

  $subscription = new Subscription();

  constructor(
    public fb: FormBuilder,
    protected tabFilterService: TableService,
    private adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    protected snackbarService: SnackBarService, // private router: Router, // private modalService: ModalService
    private financeService: FinanceService
  ) {
    super(fb, tabFilterService);
  }

  ngOnInit(): void {
    this.hotelId = this.globalFilterService.hotelId;
    this.listenForGlobalFilters();
  }

  loadData(event: LazyLoadEvent): void {
    this.initTableValue();
  }

  initTableValue() {
    this.loading = true;
    this.financeService.getInvoiceHistory(this.getQueryConfig()).subscribe(
      (res) => {
        this.values = new InvoiceHistoryList().deserialize(res)
          .records;
        this.totalRecords = res.total
      },
      () => {
        this.values = [];
        this.loading = false;
      },
      this.handleFinal
    );
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

  getQueryConfig(): QueryConfig {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        {
          offset: this.first,
          limit: this.rowsPerPage,
        },
      ]),
    };
    return config;
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
