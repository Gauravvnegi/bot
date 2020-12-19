import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseChartDirective, Label, MultiDataSet } from 'ng2-charts';
import { Document } from '../../data-models/statistics.model';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { StatisticsService } from '../../services/statistics.service';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hospitality-bot-guest-documents-statistics',
  templateUrl: './guest-documents-statistics.component.html',
  styleUrls: ['./guest-documents-statistics.component.scss']
})
export class GuestDocumentsStatisticsComponent implements OnInit {
  document: Document = new Document();
  @ViewChild(BaseChartDirective) baseChart: BaseChartDirective;

  $subscription = new Subscription();

  selectedInterval: any;

  chart: any = {
    Labels: ['Initiated', 'Pending', 'Accepted', 'Rejected'],
    Data: [[]],
    Type: 'doughnut',
    Legend : false,
    Colors : [
      {
        backgroundColor: ['#FF8F00', '#38649F', '#389F99', '#EE1044'],
        borderColor: ['#FF8F00', '#38649F', '#389F99', '#EE1044'],
      }
    ],
    Options : {
      responsive: true,
      cutoutPercentage: 75
    },
  };
  constructor(
    private _adminUtilityService: AdminUtilityService,
    private _statisticService: StatisticsService,
    private _globalFilterService: GlobalFilterService
  ) { }

  ngOnInit(): void {
    this.getDocumentStatistics();
  }

  private initGraphData() {
    this.chart.Data = [[]];
    this.chart.Data[0][0] = this.document.INITIATED;
    this.chart.Data[0][1] = this.document.PENDING;
    this.chart.Data[0][2] = this.document.ACCEPTED;
    this.chart.Data[0][3] = this.document.REJECTED;
  }

  private getDocumentStatistics() {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        let calenderType = {
          calenderType: this._adminUtilityService.getCalendarType(
            data['dateRange'].queryValue[0].toDate,
            data['dateRange'].queryValue[1].fromDate
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
          this._statisticService
            .getDocumentStatistics(config)
            .subscribe((res) => {
              this.document = new Document().deserialize(res);
              this.initGraphData();
            })
        );
      })
    );
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }

}
