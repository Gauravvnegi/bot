import { Component, OnInit } from '@angular/core';
import {FormBuilder} from '@angular/forms'

import { BaseDatatableComponent } from 'libs/admin/shared/src/lib/components/datatable/base-datatable.component';
import { title ,cols } from '../../constants/new-data-table';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { AdminUtilityService, BookingDetailService, NavRouteOption, QueryConfig } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { FinanceService } from '../../services/finance.service';

import { LazyLoadEvent } from 'primeng/api';
import { Subscription } from 'rxjs';
import { InvoiceHistoryList } from '../../models/newHistory';

@Component({
  selector: 'admin-new-test',
  templateUrl: './new-test.component.html',
  styleUrls: ['../../../../../shared/src/lib/components/datatable/datatable.component.scss','./new-test.component.scss']
})
export class NewTestComponent extends BaseDatatableComponent 
implements OnInit{
  tableName = title;
  entityId:string;
  cols =cols.invoice
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
    private globalFilterService: GlobalFilterService,
    private adminUtilityService: AdminUtilityService,
    protected snackbarService: SnackBarService,
    public bookingDetailService: BookingDetailService,
    private financeService: FinanceService
) {  super(fb);

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
 
