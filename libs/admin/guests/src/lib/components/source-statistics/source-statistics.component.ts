import { Component, OnInit } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { SnackBarService } from 'libs/shared/material/src';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';
import { DateService } from 'libs/shared/utils/src/lib/date.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { Source } from '../../data-models/statistics.model';
import { StatisticsService } from '../../services/statistics.service';
import { GuestDatatableModalComponent } from '../guest-datatable-modal/guest-datatable-modal.component';

@Component({
  selector: 'hospitality-bot-source-statistics',
  templateUrl: './source-statistics.component.html',
  styleUrls: ['./source-statistics.component.scss'],
})
export class SourceStatisticsComponent implements OnInit {
  selectedInterval: any;
  $subscription = new Subscription();
  sourceGraphData;
  globalQueries;
  // @ViewChild(BaseChartDirective) baseChart: BaseChartDirective;
  colors = ['#745AF2', '#3E8EF7', '#0BB2D4', '#FAA700', '#389F99', '#3E8EF7'];
  chart: any = {
    Labels: ['No Data'],
    Data: [[100]],
    Type: 'doughnut',
    total: 0,
    Legend: false,
    Colors: [
      {
        backgroundColor: ['#D5D1D1'],
        borderColor: ['#D5D1D1'],
      },
    ],
    Options: {
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
      cutoutPercentage: 75,
    },
  };

  chips: any = [{ label: 'All', icon: '', value: 'ALL', isSelected: true }];

  tabFilterItems = [
    {
      label: 'All',
      content: '',
      value: 'ALL',
      disabled: false,
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
    this.listenForGlobalFilters();
  }

  listenForGlobalFilters() {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        let calenderType = {
          calenderType: this.dateService.getCalendarType(
            data['dateRange'].queryValue[0].toDate,
            data['dateRange'].queryValue[1].fromDate
          ),
        };
        this.selectedInterval = calenderType.calenderType;
        this.globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
          calenderType,
        ];
        this.getSourceGraphData();
      })
    );
  }

  getSourceGraphData() {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        let calenderType = {
          calenderType: this.dateService.getCalendarType(
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
          this._statisticService.getSourceStatistics(config).subscribe(
            (response) => {
              this.sourceGraphData = new Source().deserialize(response);
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

  initGraphData() {
    this.chart.Labels = [];
    this.chart.Data = [[]];
    this.chart.Colors[0].backgroundColor = [];
    this.chart.Colors[0].borderColor = [];
    if (this.sourceGraphData) {
      Object.keys(this.sourceGraphData.sourceStats).forEach((key, i) => {
        if (this.sourceGraphData.sourceStats[key]) {
          this.chart.Labels.push(
            key.charAt(0).toUpperCase() + key.substr(1).toLowerCase()
          );
          this.chart.Data[0].push(this.sourceGraphData.sourceStats[key]);
          this.chart.Colors[0].backgroundColor.push(this.colors[i]);
          this.chart.Colors[0].borderColor.push(this.colors[i]);
        }
        this.chips.push({
          label: key,
          icon: '',
          value: key,
          isSelected: false,
          type: 'pending',
        });
      });
      this.chart.total = this.sourceGraphData.title;
    } else {
      this.chart.Labels.push('No Data');
      this.chart.Data[0].push(100);
      this.chart.Colors[0].backgroundColor.push('#D5D1D1');
      this.chart.Colors[0].borderColor.push('#D5D1D1');
      this.chart.total = 0;
      this.chips = this.chips[0];
    }
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

    tableCompRef.componentInstance.tableName = 'Guest Source';
    tableCompRef.componentInstance.tabFilterItems = this.tabFilterItems;
    tableCompRef.componentInstance.callingMethod = 'getAllGuestStats';
    tableCompRef.componentInstance.guestFilter = 'GUESTSOURCES';
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
