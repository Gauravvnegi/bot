import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogConfig } from '@angular/material/dialog';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { QueryConfig } from '@hospitality-bot/admin/library';
import {
  AdminUtilityService,
  BaseDatatableComponent,
  TableService,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { DetailsComponent as BookingDetailComponent } from 'libs/admin/reservation/src/lib/components/details/details.component';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';
import { LazyLoadEvent } from 'primeng/api';
import { Subscription } from 'rxjs';
import * as FileSaver from 'file-saver';
import { cols, title } from '../../constants/data-table';
import { InvoiceHistoryList } from '../../models/history.model';
import { FinanceService } from '../../services/finance.service';

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
  entityId: string;
  globalQueries = [];

  $subscription = new Subscription();

  constructor(
    public fb: FormBuilder,
    protected tabFilterService: TableService,
    private adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    protected snackbarService: SnackBarService, // private router: Router, // private modalService: ModalService
    private financeService: FinanceService,
    private modalService: ModalService
  ) {
    super(fb, tabFilterService);
  }

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.listenForGlobalFilters();
  }

  loadData(event: LazyLoadEvent): void {
    this.initTableValue();
  }

  initTableValue() {
    this.loading = true;
    this.financeService.getInvoiceHistory(this.getQueryConfig()).subscribe(
      (res) => {
        this.values = new InvoiceHistoryList().deserialize(res).records;
        this.totalRecords = res.total;
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

  /**
   * @function exportCSV To export CSV report of the table.
   */
  exportCSV(): void {
    this.loading = true;

    const config: QueryConfig = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.selectedRows.map((item) => ({ ids: item.reservationId })),
        { entitiyId: this.entityId },
      ]),
    };
    this.$subscription.add(
      this.financeService.exportInvoiceCSV(config).subscribe(
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
}
