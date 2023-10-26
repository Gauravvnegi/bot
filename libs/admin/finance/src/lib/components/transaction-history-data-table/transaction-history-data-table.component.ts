import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { QueryConfig } from '@hospitality-bot/admin/library';
import { MatDialogConfig } from '@angular/material/dialog';
import { DetailsComponent as BookingDetailComponent } from 'libs/admin/reservation/src/lib/components/details/details.component';
import {
  AdminUtilityService,
  BaseDatatableComponent,
  TableService,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import * as FileSaver from 'file-saver';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';
import { LazyLoadEvent } from 'primeng/api';
import { Subscription } from 'rxjs';
import { cols, transactionStatus } from '../../constants/data-table';
import { TransactionHistoryList } from '../../models/history.model';
import { FinanceService } from '../../services/finance.service';

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
  tableName = 'Transaction History';
  transactionStatus = transactionStatus;
  cols = cols.transaction;
  isQuickFilters = true;
  globalQueries = [];
  entityId: string;

  $subscription = new Subscription();

  constructor(
    public fb: FormBuilder,
    protected tabFilterService: TableService,
    private adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    protected snackbarService: SnackBarService,
    private router: Router,
    private financeService: FinanceService,
    private modalService: ModalService
  ) {
    super(fb, tabFilterService);
  }

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.listenForGlobalFilters();
  }

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
    this.globalFilterService.globalFilter$.subscribe((data) => {
      // set-global query everytime global filter changes
      this.globalQueries = [...data['dateRange'].queryValue];
      this.initTableValue();
    });
  }

  loadData(event: LazyLoadEvent): void {
    this.initTableValue();
  }

  initTableValue() {
    this.loading = true;

    this.financeService.getTransactionHistory(this.getQueryConfig()).subscribe(
      (res) => {
        const transactionHistory = new TransactionHistoryList().deserialize(
          res
        );
        this.values = transactionHistory.records;
        this.initFilters(
          transactionHistory.entityTypeCounts,
          transactionHistory.entityStateCounts,
          transactionHistory.totalRecords,
          this.transactionStatus
        );
        this.loading = false;
      },
      () => {
        this.values = [];
        this.loading = false;
      }
    );
  }

  getQueryConfig(): QueryConfig {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.getSelectedQuickReplyFilters(),
        ...this.globalQueries,
        {
          entityId: this.entityId,
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
  //       : { status: chips[0].value === 'SUCCESS' ? 'SUCCESS' : 'FAILURE' },
  //   ];
  // }

  openDetailsPage(reservationId: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '100%';
    const detailCompRef = this.modalService.openDialog(
      BookingDetailComponent,
      dialogConfig
    );

    detailCompRef.componentInstance.bookingId = reservationId;
    detailCompRef.componentInstance.tabKey = 'payment_details';
    this.$subscription.add(
      detailCompRef.componentInstance.onDetailsClose.subscribe((res) => {
        detailCompRef.close();
      })
    );
  }

  onEntityTabFilterChanges(event): void {
    this.entityId = event.entityId[0];
    this.initTableValue();
  }

  /**
   * @function exportCSV To export CSV report of the table.
   */
  exportCSV(): void {
    this.loading = true;

    const config: QueryConfig = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.selectedRows.map((item) => ({ ids: item.id })),
        {
          entitiyId: this.entityId,
          pagination: true,
          limit: this.totalRecords,
        },
        ...this.globalQueries,
      ]),
    };
    this.$subscription.add(
      this.financeService.exportCSV(config).subscribe(
        (res) => {
          FileSaver.saveAs(
            res,
            `${this.tableName.toLowerCase()}_export_${new Date().getTime()}.csv`
          );
        },
        (error) => {
          this.loading = false;
        },
        () => {
          this.loading = false;
        }
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

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
