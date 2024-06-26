import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { QueryConfig } from '@hospitality-bot/admin/library';
import {
  AdminUtilityService,
  BaseDatatableComponent,
  BookingDetailService,
  NavRouteOption,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { LazyLoadEvent } from 'primeng/api';
import { Subscription } from 'rxjs';
import * as FileSaver from 'file-saver';
import { cols, title } from '../../constants/data-table';
import { InvoiceHistoryList } from '../../models/history.model';
import { InvoiceService } from '../../services/invoice.service';

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
  navRoutes: NavRouteOption[] = [
    {
      label: 'Finance',
      link: './',
    },
  ];

  $subscription = new Subscription();

  constructor(
    public fb: FormBuilder,
    private adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    protected snackbarService: SnackBarService,
    private invoiceService: InvoiceService,
    public bookingDetailService: BookingDetailService
  ) {
    super(fb);
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
    this.invoiceService.getInvoiceHistory(this.getQueryConfig()).subscribe(
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
      this.globalQueries = [...data['dateRange'].queryValue];
      this.initTableValue();
    });
  }

  getQueryConfig(): QueryConfig {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
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

  openDetailsPage(reservationId: string) {
    this.bookingDetailService.openBookingDetailSidebar({
      tabKey: 'payment_details',
      bookingId: reservationId,
    });
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
        ...this.selectedRows.map((item) => ({ ids: item.reservationId })),
        {
          entityId: this.entityId,
          pagination: true,
          limit: this.totalRecords,
        },
        ...this.globalQueries,
      ]),
    };
    this.$subscription.add(
      this.invoiceService.exportInvoiceCSV(config).subscribe(
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
