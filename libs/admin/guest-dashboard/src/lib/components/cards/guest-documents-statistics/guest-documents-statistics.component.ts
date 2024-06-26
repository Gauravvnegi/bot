import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { AdminUtilityService, openModal } from '@hospitality-bot/admin/shared';
import { TranslateService } from '@ngx-translate/core';
import { BaseChartDirective } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { chartConfig } from '../../../constants/chart';
import { guest } from '../../../constants/guest';
import { Document } from '../../../data-models/statistics.model';
import { StatisticsService } from '../../../services/statistics.service';
import { GuestDatatableModalComponent } from '../../modal/guest-datatable/guest-datatable.component';
import { DialogService } from 'primeng/dynamicdialog';
import { GuestDialogData } from '../../../types/guest.type';

@Component({
  selector: 'hospitality-bot-guest-documents-statistics',
  templateUrl: './guest-documents-statistics.component.html',
  styleUrls: ['./guest-documents-statistics.component.scss'],
})
export class GuestDocumentsStatisticsComponent implements OnInit, OnDestroy {
  document: Document;
  @ViewChild(BaseChartDirective) baseChart: BaseChartDirective;
  $subscription = new Subscription();
  tabFilterItems = guest.tabFilterItems.documents;
  globalQueries = [];
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
    Options: chartConfig.options.documents,
  };
  constructor(
    private _adminUtilityService: AdminUtilityService,
    private _statisticService: StatisticsService,
    private globalFilterService: GlobalFilterService,
    private _translateService: TranslateService,
    public dialogService: DialogService
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
        this.getDocumentStats();
      })
    );
  }

  /**
   * @function getDocumentStats To get the guest stats based on document status.
   */
  getDocumentStats() {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams(this.globalQueries),
    };

    this.$subscription.add(
      this._statisticService
        .getDocumentStatistics(config)
        .subscribe((response) => {
          this.document = new Document().deserialize(response);
          this.initGraphData();
        })
    );
  }

  /**
   * @function initGraphData To initialize graph data, labels and colors.
   */
  private initGraphData(): void {
    this.chart.Data = [[]];
    this.chart.Colors[0].backgroundColor = [];
    this.chart.Colors[0].borderColor = [];
    this.chart.Labels = [];
    this.document.statistics.forEach((stat) => {
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
   * @function openTableModal To open modal pop-up for guest table based on document status filter.
   */
  openTableModal() {
    const data: GuestDialogData = {
      tabFilterItems: this.tabFilterItems,
      callingMethod: 'getGuestDocsStats',
      entityType: 'GUESTDOCUMENTS',
      exportURL: 'exportDocsCSV',
      tableName: 'Guest Documents',
    };

    openModal({
      config: { width: '80%', data: data },
      dialogService: this.dialogService,
      component: GuestDatatableModalComponent,
    });
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
