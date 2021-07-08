import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SnackBarService } from 'libs/shared/material/src';
import { Subscription } from 'rxjs';
import { DateService } from 'libs/shared/utils/src/lib/date.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { WhatsappMessageAnalyticsComponent } from '../whatsapp-message-analytics/whatsapp-message-analytics.component';
import { Tab } from '../../models/tab.model';
@Component({
  selector: 'hospitality-bot-message-analytics',
  templateUrl: './message-analytics.component.html',
  styleUrls: [
    './message-analytics.component.scss',
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
  ],
})
export class MessageAnalyticsComponent implements OnInit {
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
  $subscription = new Subscription();
  analyticsFG: FormGroup;
  tabFilterIdx: number = 0;

  tabFilterItems = [
    new Tab({
      component: WhatsappMessageAnalyticsComponent,
      title: 'WhatsApp',
      tabData: { parent: 'MessageAnalyticsComponent' },
    }),
  ];
  constructor(
    private fb: FormBuilder,
    private _adminUtilityService: AdminUtilityService,
    private _globalFilterService: GlobalFilterService,
    private _snackbarService: SnackBarService,
    private dateService: DateService
  ) {}

  ngOnInit(): void {
    this.initFG();
    // this.setChartLabels();
    this.registerListeners();
  }

  registerListeners() {
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
  }

  exportCSV() {}
}
