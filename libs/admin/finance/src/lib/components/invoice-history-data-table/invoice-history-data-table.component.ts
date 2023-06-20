import { Component, OnInit } from '@angular/core';
import {
  cols,
  filters,
  TableValue,
  title,
} from '../../constants/data-table';
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
import { InvoiceHistory } from '../../models/history.model';
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
  tabFilterItems = filters;
  selectedTable: TableValue;
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
    private financeService: FinanceService,
  ) {
    super(fb, tabFilterService);
  }

  ngOnInit(): void {
    this.hotelId = this.globalFilterService.hotelId;
    this.listenForGlobalFilters();
    this.initTableValue();
    // this.listenToTableChange();
  }

  // /**
  //  * @function listenToTableChange  To listen to table changes
  //  */
  // listenToTableChange() {
  //   this.financeService.selectedTable.subscribe((value) => {
  //     this.selectedTable = value;
  //     this.initTableValue();
  //   });
  // }

  loadData(event: LazyLoadEvent): void {
    this.initTableValue();
  }

  initTableValue() {
    this.loading = true;
    this.financeService.getInvoiceHistory().subscribe(
      (res) => {
        const invoiceHistory = new InvoiceHistory().deserailize(res);
        this.values = res;
        // this.updateTabFilterCount(res.entityTypeCounts, res.total);
        // this.updateQuickReplyFilterCount(res.entityStateCounts);
        // this.updateTotalRecords();
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
        ...data['dateRange'].queryValue,
      ];
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

  // /**
  //  * @function getSelectedQuickReplyFilters To return the selected chip list.
  //  * @returns The selected chips.
  //  */
  // getSelectedQuickReplyFilters() {
  //   const chips = this.filterChips.filter(
  //     (item) => item.isSelected && item.value !== 'ALL'
  //   );
  //   return [
  //     chips.length !== 1
  //       ? { status: null }
  //       : { status: chips[0].value === 'PAID' },
  //   ];
  // }

  // onSelectedTabFilterChange(event: MatTabChangeEvent): void {
  //   this.financeService.selectedTable.next(
  //     this.tabFilterItems[event.index].value
  //   );
  //   this.tabFilterIdx = event.index;
  //   this.initTableValue();
  // }

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
