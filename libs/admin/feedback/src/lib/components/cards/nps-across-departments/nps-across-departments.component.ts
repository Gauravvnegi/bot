import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { feedback } from '@hospitality-bot/admin/feedback';
import {
  AdminUtilityService,
  sharedConfig,
  StatisticsService,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { DateService } from '@hospitality-bot/shared/utils';
import * as FileSaver from 'file-saver';
import { Subscription } from 'rxjs';
import { NPSDepartments } from '../../../data-models/statistics.model';

@Component({
  selector: 'hospitality-bot-nps-across-departments',
  templateUrl: './nps-across-departments.component.html',
  styleUrls: [
    '../../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './nps-across-departments.component.scss',
  ],
})
export class NpsAcrossDepartmentsComponent implements OnInit {
  @Input() globalFeedbackFilterType: string;
  feedbackConfig = feedback;
  npsFG: FormGroup;
  documentTypes = [{ label: 'CSV', value: 'csv' }];
  npsChartData: NPSDepartments;
  $subscription: Subscription = new Subscription();
  globalQueries = [];
  selectedInterval: string;
  loading: boolean = false;

  documentActionTypes = [
    {
      label: `Export`,
      value: 'export',
      type: 'countType',
      defaultLabel: 'Export',
    },
  ];

  constructor(
    protected fb: FormBuilder,
    protected _adminUtilityService: AdminUtilityService,
    protected _statisticService: StatisticsService,
    protected _globalFilterService: GlobalFilterService,
    protected _snackbarService: SnackBarService,
    protected dateService: DateService
  ) {}

  ngOnInit(): void {
    this.initFG();
    this.registerListeners();
  }

  registerListeners(): void {
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
        this.selectedInterval = calenderType.calenderType;
        this.globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
          calenderType,
        ];
        this.setEntityId();
        this.getNPSChartData();
      })
    );
  }

  setEntityId() {
    this.globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) {
        this.globalQueries = [
          ...this.globalQueries,
          { entityIds: element.hotelId },
        ];
      }
    });
  }

  /**
   * @function initFG To intialize NPS form group.
   */
  initFG(): void {
    this.npsFG = this.fb.group({
      documentType: ['csv'],
      documentActionType: ['Export All'],
    });
  }

  /**
   * @function getNPSChartData To get NPS department chart data.
   */
  protected getNPSChartData(): void {
    this.loading = true;
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        { feedbackType: this.feedbackConfig.types.stay },
      ]),
    };
    this.$subscription.add(
      this._statisticService.getDepartmentsStatistics(config).subscribe(
        (response) => {
          this.npsChartData = new NPSDepartments().deserialize(
            response.npsStats
          );
          this.loading = false;
        },
        ({ error }) => {
          this.loading = false;
          this._snackbarService
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
    );
  }

  /**
   * @function exportCSV To export CSV report for NPS across department.
   */
  exportCSV(): void {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        {
          order: sharedConfig.defaultOrder,
          feedbackType: this._statisticService.type,
        },
      ]),
    };
    this.$subscription.add(
      this._statisticService.exportOverallDepartmentsCSV(config).subscribe(
        (response) => {
          FileSaver.saveAs(
            response,
            'NPS_Across_Departments_export_' + new Date().getTime() + '.csv'
          );
        },
        ({ error }) =>
          this._snackbarService
            .openSnackBarWithTranslate(
              {
                translateKey: 'messages.error.some_thing_wrong',
                priorityMessage: error?.message,
              },
              ''
            )
            .subscribe()
      )
    );
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}