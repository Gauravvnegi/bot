import { Component, OnInit, OnDestroy } from '@angular/core';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { DateService } from 'libs/shared/utils/src/lib/date.service';
import { Subscription } from 'rxjs';
import { ReservationStat } from '../../data-models/statistics.model';
import { StatisticsService } from '../../services/statistics.service';

@Component({
  selector: 'hospitality-bot-customer-statistics',
  templateUrl: './customer-statistics.component.html',
  styleUrls: ['./customer-statistics.component.scss'],
})
export class CustomerStatisticsComponent implements OnInit, OnDestroy {
  private $subscription = new Subscription();
  statData: ReservationStat;
  globalQueries;

  checkinChart: any = {
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
      cutoutPercentage: 75,
    },
  };

  checkoutChart: any = {
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
      cutoutPercentage: 75,
    },
  };

  constructor(
    private statisticsService: StatisticsService,
    private _globalFilterService: GlobalFilterService,
    private _adminUtilityService: AdminUtilityService,
    private dateService: DateService
  ) {}

  ngOnInit() {
    this.listenForGlobalFilters();
  }

  listenForGlobalFilters() {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        let calenderType = {
          calenderType: this.dateService.getCalendarType(
            data['dateRange'].queryValue[0].toDate,
            data['dateRange'].queryValue[1].fromDate,
            this._globalFilterService.timezone
          ),
        };
        this.globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
          calenderType,
        ];
        this.getReservationStatistics();
      })
    );
  }

  getReservationStatistics() {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams(this.globalQueries),
    };
    this.$subscription.add(
      this.statisticsService
        .getReservationStatistics(config)
        .subscribe((response) => {
          this.statData = new ReservationStat().deserialize(response);
          this.initCheckinChart();
          this.initCheckoutChart();
        })
    );
  }

  initCheckinChart() {
    this.checkinChart.Labels = [];
    this.checkinChart.Data[0] = [];
    this.checkinChart.Colors = [];
    if (this.statData.checkin.totalCount) {
      if (this.statData.checkin.checkIn) {
        this.checkinChart.Labels.push('Check-In');
        this.checkinChart.Data[0].push(this.statData.checkin.checkIn);
        this.checkinChart.Colors.push({
          backgroundColor: ['#0ea47a'],
          borderColor: ['#0ea47a'],
        });
      }
      if (this.statData.checkin.expressCheckIn) {
        this.checkinChart.Labels.push('Express Check-In');
        this.checkinChart.Data[0].push(this.statData.checkin.expressCheckIn);
        this.checkinChart.Colors.push({
          backgroundColor: ['#15eda3'],
          borderColor: ['#15eda3'],
        });
      }
    } else {
      this.checkinChart.Labels = ['No Data'];
      this.checkinChart.Data[0] = [100];
      this.checkinChart.Colors = [
        {
          backgroundColor: ['#D5D1D1'],
          borderColor: ['#D5D1D1'],
        },
      ];
    }
  }

  initCheckoutChart() {
    this.checkoutChart.Labels = [];
    this.checkoutChart.Data[0] = [];
    this.checkoutChart.Colors = [];
    if (this.statData.checkout.totalCount) {
      if (this.statData.checkout.checkout) {
        this.checkoutChart.Labels.push('Check-Out');
        this.checkoutChart.Data[0].push(this.statData.checkout.checkout);
        this.checkoutChart.Colors.push({
          backgroundColor: ['#FF4545'],
          borderColor: ['#FF4545'],
        });
      }
      if (this.statData.checkout.expressCheckout) {
        this.checkoutChart.Labels.push('Express Check-Out');
        this.checkoutChart.Data[0].push(this.statData.checkout.expressCheckout);
        this.checkoutChart.Colors.push({
          backgroundColor: ['#FF9867'],
          borderColor: ['#FF9867'],
        });
      }
    } else {
      this.checkoutChart.Labels = ['No Data'];
      this.checkoutChart.Data[0] = [100];
      this.checkoutChart.Colors = [
        {
          backgroundColor: ['#D5D1D1'],
          borderColor: ['#D5D1D1'],
        },
      ];
    }
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
