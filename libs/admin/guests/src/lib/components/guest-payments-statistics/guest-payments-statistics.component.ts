import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseChartDirective, Label, MultiDataSet } from 'ng2-charts';
import { ChartType } from 'chart.js';
import { StatisticsService } from '../../services/statistics.service';
import { Payment } from '../../data-models/statistics.model';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { Subscription } from 'rxjs';
import { SnackBarService } from 'libs/shared/material/src';
import { MatDialogConfig } from '@angular/material/dialog';
import { GuestDatatableModalComponent } from '../guest-datatable-modal/guest-datatable-modal.component';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';
import { DateService } from 'libs/shared/utils/src/lib/date.service';

@Component({
  selector: 'hospitality-bot-guest-payments-statistics',
  templateUrl: './guest-payments-statistics.component.html',
  styleUrls: ['./guest-payments-statistics.component.scss'],
})
export class GuestPaymentsStatisticsComponent implements OnInit {
  @ViewChild(BaseChartDirective) baseChart: BaseChartDirective;
  payment: Payment = new Payment().deserialize({
    totalCount: 0,
    guestPayment: {
      FULL: 0,
      PARTIAL: 0,
      PENDING: 0,
    },
  });
  $subscription = new Subscription();
  selectedInterval: any;
  chart: any = {
    Labels: ['No Data'],
    Data: [[100]],
    Type: 'doughnut',

    Legend: false,
    Colors: [
      {
        backgroundColor: ['#D5D1D1'],
        borderColor: ['#D5D1D1'],
      },
    ],
    Options: {
      tooltips: {
        backgroundColor: 'white',
        bodyFontColor: 'black',
        borderColor: '#f4f5f6',
        borderWidth: 3,
        titleFontColor: 'black',
        titleMarginBottom: 5,
        xPadding: 10,
        yPadding: 10,
      },
      responsive: true,
      elements: {
        center: {
          text: '401',
          text3: 'Total Users',
          fontColor: '#000',
          fontFamily: "CalibreWeb, 'Helvetica Neue', Arial ",
          fontSize: 36,
          fontStyle: 'normal',
        },
      },
      cutoutPercentage: 0,
    },
  };

  chips = [
    { label: 'All', icon: '', value: 'ALL', isSelected: true },
    {
      label: 'Fully Recieved',
      icon: '',
      value: 'FULLYRECIEVED',
      total: 0,
      isSelected: false,
      type: 'pending',
    },
    {
      label: 'Partially Recieved ',
      icon: '',
      value: 'PARTIALLYRECIEVED',
      total: 0,
      isSelected: false,
      type: 'initiated',
    },
    {
      label: 'Not Recieved ',
      icon: '',
      value: 'NOTRECIEVED',
      total: 0,
      isSelected: false,
      type: 'completed',
    },
  ];

  tabFilterItems = [
    {
      label: 'All',
      content: '',
      value: 'ALL',
      disabled: false,
      total: 0,
      chips: this.chips,
      lastPage: 0,
    },
    {
      label: 'VIP',
      content: '',
      value: 'VIP',
      disabled: false,
      total: 0,
      chips: this.chips,
      lastPage: 0,
    },
    {
      label: 'General',
      content: '',
      value: 'GENERAL',
      disabled: false,
      total: 0,
      chips: this.chips,
      lastPage: 0,
    },
  ];

  constructor(
    private _adminUtilityService: AdminUtilityService,
    private _statisticService: StatisticsService,
    private _globalFilterService: GlobalFilterService,
    private _snackbarService: SnackBarService,
    private _modal: ModalService,
    private dateService: DateService
  ) {}

  ngOnInit(): void {
    this.getPaymentStatistics();
  }

  private initGraphData(): void {
    this.chart.Data = [[]];
    this.chart.Data[0][0] = this.payment.FULL;
    this.chart.Data[0][1] = this.payment.PARTIAL;
    this.chart.Data[0][2] = this.payment.PENDING;

    if (this.chart.Data[0].reduce((a, b) => a + b, 0)) {
      this.setChartOptions();
    } else {
      this.chart.Data = [[100]];
      this.chart.Colors = [
        {
          backgroundColor: ['#D5D1D1'],
          borderColor: ['#D5D1D1'],
        },
      ];
      this.chart.Labels = ['No data'];
    }
  }

  private getPaymentStatistics(): void {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        let calenderType = {
          calenderType: this.dateService.getCalendarType(
            data['dateRange'].queryValue[0].toDate,
            data['dateRange'].queryValue[1].fromDate,
            this._globalFilterService.timezone
          ),
        };
        this.selectedInterval = calenderType.calenderType;
        const queries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
          calenderType,
        ];

        const config = {
          queryObj: this._adminUtilityService.makeQueryParams(queries),
        };
        this.$subscription.add(
          this._statisticService.getPaymentStatistics(config).subscribe(
            (res) => {
              this.payment = new Payment().deserialize(res);
              this.initGraphData();
            },
            ({ error }) => {
              this._snackbarService.openSnackBarAsText(error.message);
            }
          )
        );
      })
    );
  }

  setChartOptions(): void {
    this.chart.Colors = [
      {
        backgroundColor: ['#3E8EF7', '#FAA700', '#FF4C52'],
        borderColor: ['#3E8EF7', '#FAA700', '#FF4C52'],
      },
    ];
    this.chart.Labels = [
      'Fully Received',
      'Partially Received',
      'Not Received',
    ];
  }

  openTableModal() {
    // event.stopPropagation();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '100%';
    const tableCompRef = this._modal.openDialog(
      GuestDatatableModalComponent,
      dialogConfig
    );

    tableCompRef.componentInstance.tableName = 'Guest Payments';
    tableCompRef.componentInstance.tabFilterItems = this.tabFilterItems;
    tableCompRef.componentInstance.callingMethod = 'getAllGuestStats';
    tableCompRef.componentInstance.guestFilter = 'GUESTPAYMENTS';
    tableCompRef.componentInstance.exportURL = 'exportCSVStat';

    this.$subscription.add(
      tableCompRef.componentInstance.onModalClose.subscribe((res) => {
        tableCompRef.close();
      })
    );
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
