import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseChartDirective, Label, MultiDataSet } from 'ng2-charts';
import { Document } from '../../data-models/statistics.model';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { StatisticsService } from '../../services/statistics.service';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { Subscription } from 'rxjs';
import { MatDialogConfig } from '@angular/material/dialog';
import { GuestDatatableModalComponent } from '../guest-datatable-modal/guest-datatable-modal.component';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';

@Component({
  selector: 'hospitality-bot-guest-documents-statistics',
  templateUrl: './guest-documents-statistics.component.html',
  styleUrls: ['./guest-documents-statistics.component.scss']
})
export class GuestDocumentsStatisticsComponent implements OnInit {
  document: Document = new Document().deserialize({
    totalCount: 0,
    documentStats: {
      INITIATED: 0,
      FAILED: 0,
      PENDING: 0,
      COMPLETED: 0
    }
  });
  @ViewChild(BaseChartDirective) baseChart: BaseChartDirective;

  $subscription = new Subscription();

  selectedInterval: any;

  chips = [
    { label: 'All', icon: '', value: 'ALL', total: 0, isSelected: true },
    {
      label: 'VIP',
      icon: '',
      value: 'VIP',
      total: 0,
      isSelected: false,
      type: 'pending',
    },
    {
      label: 'High Potential ',
      icon: '',
      value: 'HIGHPOTENTIAL',
      total: 0,
      isSelected: false,
      type: 'initiated',
    },
    {
      label: 'High Risk ',
      icon: '',
      value: 'HIGHRISK',
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
    },
    {
      label: 'Initiated',
      content: '',
      value: 'INITIATED',
      disabled: false,
      total: 0,
      chips: this.chips
    },
    {
      label: 'Pending',
      content: '',
      value: 'PENDING',
      disabled: false,
      total: 0,
      chips: this.chips
    },
    {
      label: 'Accepted',
      content: '',
      value: 'ACCEPTED',
      disabled: false,
      total: 0,
      chips: this.chips
    },
    {
      label: 'Rejected',
      content: '',
      value: 'REJECTED',
      disabled: false,
      total: 0,
      chips: this.chips
    }
  ];

  chart: any = {
    Labels: ['No Data'],
    Data: [[100]],
    Type: 'doughnut',
    Legend : false,
    Colors : [
      {
        backgroundColor: ['#D5D1D1'],
        borderColor: ['#D5D1D1'],
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
    private _globalFilterService: GlobalFilterService,
    private _modal: ModalService
  ) { }

  ngOnInit(): void {
    this.getDocumentStatistics();
  }

  private initGraphData(): void {
    this.chart.Data = [[]];
    this.chart.Data[0][0] = this.document.INITIATED;
    this.chart.Data[0][1] = this.document.PENDING;
    this.chart.Data[0][2] = this.document.ACCEPTED;
    this.chart.Data[0][3] = this.document.REJECTED;

    if (this.chart.Data[0].reduce((a, b) => a + b, 0)) {
      this.setChartOptions();
    } else {
      this.chart.Data = [[100]];
      this.chart.Colors = [{
        backgroundColor: ['#D5D1D1'],
        borderColor: ['#D5D1D1'],
      }];
      this.chart.Labels = ['No data'];
    }
  }

  private getDocumentStatistics(): void {
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

  setChartOptions() {
    this.chart.Labels = ['Initiated', 'Pending', 'Accepted', 'Rejected'];

    this.chart.Colors = [{
      backgroundColor: ['#FF8F00', '#38649F', '#389F99', '#EE1044'],
      borderColor: ['#FF8F00', '#38649F', '#389F99', '#EE1044'],
    }];
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

    tableCompRef.componentInstance.tableName = 'Guest Documents';
    tableCompRef.componentInstance.tabFilterItems = this.tabFilterItems;
    tableCompRef.componentInstance.callingMethod = 'getAllGuestDocuments';

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
