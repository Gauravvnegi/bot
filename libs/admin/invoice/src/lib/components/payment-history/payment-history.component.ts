import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
  AdminUtilityService,
  BaseDatatableComponent,
  NavRouteOptions,
  TableService,
} from '@hospitality-bot/admin/shared';
import { invoiceRoutes } from '../../constants/routes';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  filters,
  paymentHistoryCols,
  records,
} from '../../constants/payment-history';
import { MatTabChangeEvent } from '@angular/material/tabs/tab-group';
import { PaymentHistoryList } from '../../models/invoice.model';
import { InvoiceService } from '../../services/invoice.service';
import { PaymentHistoryListRespone } from '../../types/response.type';
import { LazyLoadEvent } from 'primeng/api';

@Component({
  selector: 'hospitality-bot-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: [
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './payment-history.component.scss',
  ],
})
export class PaymentHistoryComponent extends BaseDatatableComponent {
  navRoutes: NavRouteOptions;
  pageTitle: string;
  reservationId: string;
  hotelId: string;
  tabFilterItems = filters;
  selectedTable;
  tableName;
  cols = paymentHistoryCols;
  isQuickFilters = true;
  paymentHistoryList: PaymentHistoryList;
  $subscription = new Subscription();
  globalQueries = [];
  configData;
  tabFilterIdx = 0;

  constructor(
    public fb: FormBuilder,
    protected tabFilterService: TableService,
    private activatedRoute: ActivatedRoute,
    private globalFilterService: GlobalFilterService,
    private adminUtilityService: AdminUtilityService,
    private invoiceService: InvoiceService
  ) {
    super(fb, tabFilterService);

    this.reservationId = this.activatedRoute.snapshot.paramMap.get('id');
    this.initPageHeaders();
  }

  ngOnInit(): void {
    this.hotelId = this.globalFilterService.hotelId;
    // this.getConfigData();
    this.listenGlobalFilters();
  }

  initPageHeaders() {
    const { title, navRoutes } = invoiceRoutes['paymentHistory'];
    this.pageTitle = title;
    this.navRoutes = navRoutes;
  }

  listenGlobalFilters() {
    this.globalFilterService.globalFilter$.subscribe((data) => {
      this.globalQueries = [
        ...data['filter'].queryValue,
        ...data['dateRange'].queryValue,
      ];
      this.listenToTableChange();
    });
  }

  listenToTableChange() {
    this.invoiceService.selectedTable.subscribe((value) => {
      this.selectedTable = value;
      this.loadData();
    });
  }

  loadData() {
    // this.loading = true;
    this.values = records;
    // this.invoiceService
    //   .getPaymentHistory<PaymentHistoryListRespone>(this.getQueryConfig())
    //   .subscribe((res)=>{
    //     this.paymentHistoryList = new PaymentHistoryList().deserialize(res);
    //     this.values = this.paymentHistoryList.paymentHistoryData.map((item)=>item);
    //     this.updateTabFilterCount(res.entityStateCounts, res.total);
    //     this.updateTotalRecords();
    //     },
    //     ({ error})=>{
    //       this.values = [];
    //       this.handleError;
    //     },
    //     this.handleFinal
    //   );
  }

  getQueryConfig() {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        // ...this.getSelectedQuickReplyFilters(),
        {
          entityType: this.selectedTable,
          entityId: this.hotelId,
          offset: this.first,
          limit: this.rowsPerPage,
        },
      ]),
    };
    return config;
  }

  onSelectedTabFilterChange(event: MatTabChangeEvent): void {
    this.selectedTable = this.tabFilterItems[event.index].value;
    console.log("Selected Table", this.selectedTable);
    this.tabFilterIdx = event.index;
    console.log("Selected Table", this.tabFilterIdx);
    this.loadData();
  }

  updatePaginations(event: LazyLoadEvent): void {
    this.first = event.first;
    this.rowsPerPage = event.rows;
  }

  /**
   * @function handleError to show the error
   * @param param network error
   */
  handleError = ({ error }): void => {
    this.loading = false;
  };

  handleFinal = () => {
    this.loading = false;
  };

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
