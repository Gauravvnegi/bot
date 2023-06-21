import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateService } from '@hospitality-bot/shared/utils';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { MessageTabService } from 'apps/admin/src/app/core/theme/src/lib/services/messages-tab.service';
import * as FileSaver from 'file-saver';
import { AnalyticsService } from 'libs/admin/request-analytics/src/lib/services/analytics.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { SnackBarService } from 'libs/shared/material/src';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hospitality-bot-message-analytics',
  templateUrl: './message-analytics.component.html',
  styleUrls: [
    './message-analytics.component.scss',
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
  ],
})
export class MessageAnalyticsComponent implements OnInit, OnDestroy {
  documentActionTypes = [
    {
      label: `Export`,
      value: 'export',
      type: 'countType',
      defaultLabel: 'Export',
    },
  ];
  documentTypes = [
    { label: 'CSV', value: 'csv' },
    // { label: 'EXCEL', value: 'excel' },
    // { label: 'PDF', value: 'pdf' },
  ];
  selectedInterval;
  globalQueries;
  hotelId: string;
  $subscription = new Subscription();
  analyticsFG: FormGroup;
  tabFilterIdx = 0;

  tabFilterItems = [
    {
      label: 'WhatsApp',
      value: 'whatsapp',
      title: 'WhatsApp',
    },
    // new Tab({
    //   component: WhatsappMessageAnalyticsComponent,
    //   title: 'WhatsApp',
    //   tabData: { parent: 'MessageAnalyticsComponent' },
    // }),
  ];
  constructor(
    private fb: FormBuilder,
    private _adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    private snackbarService: SnackBarService,
    private dateService: DateService,
    private analyticService: AnalyticsService,
    private messageTabService: MessageTabService
  ) {}

  ngOnInit(): void {
    this.initFG();
    // this.setChartLabels();
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
        ];
        this.hotelId = this.globalFilterService.hotelId;
      })
    );
  }

  initFG(): void {
    this.analyticsFG = this.fb.group({
      documentType: ['csv'],
      documentActionType: ['Export All'],
    });
  }

  onSelectedTabFilterChange(event) {
    this.tabFilterIdx = event.index;
    // this.messageTabService.selectedTabMenu$.next(event.index);
  }

  exportCSV() {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams(this.globalQueries),
    };
    this.$subscription.add(
      this.analyticService
        .exportCSV(this.hotelId, config)
        .subscribe((res) =>
          FileSaver.saveAs(
            res,
            'Message_Analytics_export_' + new Date().getTime() + '.csv'
          )
        )
    );
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
