import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { AdminUtilityService } from '@hospitality-bot/admin/shared';
import {
  ModalService,
  SnackBarService,
} from '@hospitality-bot/shared/material';
import { TranslateService } from '@ngx-translate/core';
import { BaseChartDirective } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { chartConfig } from '../../../constants/chart';
import { guest } from '../../../constants/guest';
import { Payment } from '../../../data-models/statistics.model';
import { StatisticsService } from '../../../services/statistics.service';
import { GuestDatatableModalComponent } from '../../modal/guest-datatable/guest-datatable.component';

@Component({
  selector: 'hospitality-bot-guest-payments-statistics',
  templateUrl: './guest-payments-statistics.component.html',
  styleUrls: ['./guest-payments-statistics.component.scss'],
})
export class GuestPaymentsStatisticsComponent implements OnInit, OnDestroy {
  @ViewChild(BaseChartDirective) baseChart: BaseChartDirective;
  payment: Payment;
  tabFilterItems = guest.tabFilterItems.payments;
  globalQueries = [];
  $subscription = new Subscription();
  guestConfig = guest;
  chart: any = {
    Labels: ['No Data'],
    Data: [[100]],
    Type: chartConfig.type.doughnut,
    Legend: false,
    Colors: [
      {
        backgroundColor: [chartConfig.defaultColor],
        borderColor: [chartConfig.defaultColor],
      },
    ],
    Options: chartConfig.options.payments,
  };

  constructor(
    private _adminUtilityService: AdminUtilityService,
    private _statisticService: StatisticsService,
    private globalFilterService: GlobalFilterService,
    private snackbarService: SnackBarService,
    private _modal: ModalService,
    private _translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.registerListeners();
  }

  registerListeners() {
    this.listenForGlobalFilters();
  }

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
        this.globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ];
        this.getPaymentStats();
      })
    );
  }

  /**
   * @function getPaymentStats To get the guest stats based on payment status.
   */
  getPaymentStats() {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams(this.globalQueries),
    };
    this.$subscription.add(
      this._statisticService
        .getPaymentStatistics(config)
        .subscribe((response) => {
          this.payment = new Payment().deserialize(response);
          this.initGraphData();
        })
    );
  }

  /**
   * @function initGraphData To initialize graph data, labels and colors.
   */
  private initGraphData(): void {
    this.chart.Data = [[]];
    this.chart.Data = [[]];
    this.chart.Colors[0].backgroundColor = [];
    this.chart.Colors[0].borderColor = [];
    this.chart.Labels = [];
    this.payment.statistics.forEach((stat) => {
      if (stat.value) {
        this.chart.Data[0].push(stat.value);
        this.chart.Labels.push(stat.label);
        this.chart.Colors[0].backgroundColor.push(stat.color);
        this.chart.Colors[0].borderColor.push(stat.color);
      }
    });

    if (this.chart.Data[0].length === 0) {
      this._translateService
        .get('graph_no_data')
        .subscribe((message) => (this.chart.Labels = [message]));
      this.chart.Data = [[100]];
      this.chart.Colors[0].backgroundColor = [chartConfig.defaultColor];
      this.chart.Colors[0].borderColor = [chartConfig.defaultColor];
    }
  }

  /**
   * @function openTableModal To open modal pop-up for guest table based on payment status filter.
   */
  openTableModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '100%';
    const tableCompRef = this._modal.openDialog(
      GuestDatatableModalComponent,
      dialogConfig
    );

    this._translateService
      .get('payment.title')
      .subscribe(
        (message) => (tableCompRef.componentInstance.tableName = message)
      );
    tableCompRef.componentInstance.tabFilterItems = this.tabFilterItems;
    tableCompRef.componentInstance.callingMethod = 'getAllGuestStats';
    tableCompRef.componentInstance.guestFilter = 'GUESTPAYMENTS';
    tableCompRef.componentInstance.exportURL = 'exportCSVStat';

    tableCompRef.componentInstance.onModalClose.subscribe((res) => {
      tableCompRef.close();
    });
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
