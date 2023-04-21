import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { AdminUtilityService } from '@hospitality-bot/admin/shared';
import {
  ModalService,
  SnackBarService,
} from '@hospitality-bot/shared/material';
import { DateService } from '@hospitality-bot/shared/utils';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { chartConfig } from '../../../constants/chart';
import { guest, SourceChipsType } from '../../../constants/guest';
import { Source } from '../../../data-models/statistics.model';
import { StatisticsService } from '../../../services/statistics.service';
import { GuestDatatableModalComponent } from '../../modal/guest-datatable/guest-datatable.component';

@Component({
  selector: 'hospitality-bot-source-statistics',
  templateUrl: './source-statistics.component.html',
  styleUrls: ['./source-statistics.component.scss'],
})
export class SourceStatisticsComponent implements OnInit, OnDestroy {
  selectedInterval: any;
  $subscription = new Subscription();
  sourceGraphData: Source;
  globalQueries = [];
  guestConfig = guest;
  chart: any = {
    Labels: ['No Data'],
    Data: [[100]],
    Type: chartConfig.type.doughnut,
    total: 0,
    Legend: false,
    Colors: [
      {
        backgroundColor: [chartConfig.defaultColor],
        borderColor: [chartConfig.defaultColor],
      },
    ],
    Options: chartConfig.options.source,
  };

  chips: any = [
    {
      label: 'All',
      icon: '',
      value: 'ALL',
      isSelected: true,
      type: 'default',
    },
  ];

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
    private globalFilterService: GlobalFilterService,
    private snackbarService: SnackBarService,
    private _modal: ModalService,
    private dateService: DateService,
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
        const calenderType = {
          calenderType: this.dateService.getCalendarType(
            data['dateRange'].queryValue[0].toDate,
            data['dateRange'].queryValue[1].fromDate,
            this.globalFilterService.timezone
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

  /**
   * @function getSourceGraphData To get the guest stats based on source.
   */
  getSourceGraphData() {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams(this.globalQueries),
    };
    this.$subscription.add(
      this.$subscription.add(
        this._statisticService.getSourceStatistics(config).subscribe(
          (response) => {
            this.sourceGraphData = new Source().deserialize(response);
            this.initGraphData();
          },
          ({ error }) => {
            this.snackbarService
              .openSnackBarWithTranslate(
                {
                  translateKey: 'messages.error.some_thing_wrong',
                  priorityMessage: error?.message,
                },
                ''
              )
              .subscribe();
          }
        )
      )
    );
  }

  /**
   * @function initGraphData To initialize graph data, labels and colors.
   */
  initGraphData() {
    this.chart.Labels = [];
    this.chart.Data[0] = [];
    this.chart.Colors[0].backgroundColor = [];
    this.chart.Colors[0].borderColor = [];
    this.chips = [this.chips[0]];
    this.sourceGraphData.statistics.forEach((stat) => {
      if (stat.value) {
        this.chart.Labels.push(stat.label);
        this.chart.Data[0].push(stat.value);
        this.chart.Colors[0].backgroundColor.push(stat.color);
        this.chart.Colors[0].borderColor.push(stat.color);
      }
      this.chips.push({
        label: stat.label.toUpperCase(),
        icon: '',
        value: stat.label.toUpperCase(),
        isSelected: false,
        total: 0,
        type: SourceChipsType[stat.label],
      });
    });
    if (!this.chart.Data[0].length) {
      this.initDefaultGraph();
    }
    this.chart.total = this.sourceGraphData.totalCount;
  }

  /**
   * @function initDefaultGraph To initialize default graph data, labels and colors.
   */
  initDefaultGraph() {
    this._translateService
      .get('graph_no_data')
      .subscribe((message) => (this.chart.Labels = [message]));
    this.chart.Data[0].push(100);
    this.chart.Colors[0].backgroundColor.push(chartConfig.defaultColor);
    this.chart.Colors[0].borderColor.push(chartConfig.defaultColor);
    this.chart.total = 0;
  }

  /**
   * @function updateTabChips To update the chips to the tab filters.
   */
  updateTabChips() {
    this.tabFilterItems.forEach((item) => (item.chips = this.chips));
  }

  /**
   * @function openTableModal To open modal pop-up for guest table based on source filter.
   */
  openTableModal() {
    this.updateTabChips();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '100%';
    const tableCompRef = this._modal.openDialog(
      GuestDatatableModalComponent,
      dialogConfig
    );

    this._translateService
      .get('source.title')
      .subscribe(
        (message) => (tableCompRef.componentInstance.tableName = message)
      );
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
