import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
  tabFilterItems = [];
  tabFilterIdx = 0;
  tabfeedbackType;
  chartTypes = [feedback.chartType.bar, feedback.chartType.sentiment];

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
    if (
      this.globalFeedbackFilterType ===
        this.feedbackConfig.types.transactional ||
      this.globalFeedbackFilterType === this.feedbackConfig.types.both
    ) {
      this.listenForOutletChanged();
    }
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
        if (
          this.globalFeedbackFilterType !=
          data['filter'].value.feedback.feedbackType
        ) {
          this.globalFeedbackFilterType =
            data['filter'].value.feedback.feedbackType;
          this.tabFilterItems = [];
          this.tabFilterIdx = 0;
          this.tabfeedbackType = undefined;
        }
        this.setEntityId(data['filter'].value.feedback.feedbackType);
        if (this.tabFilterItems.length == 0) this.getNPSDepartments();
        else this.getNPSChartData();
      })
    );
  }

  listenForOutletChanged() {
    this._statisticService.$outletChange.subscribe((response) => {
      if (response.status) {
        this.globalQueries.forEach((element) => {
          if (element.hasOwnProperty('entityIds')) {
            element.entityIds = this._statisticService.outletIds;
          }
        });
        if (response.status != this.tabfeedbackType) {
          this.tabFilterItems = [];
          this.tabFilterIdx = 0;
          this.tabfeedbackType = response.type;
          this.getNPSDepartments();
        } else {
          this.getNPSChartData();
        }
      }
    });
  }

  setEntityId(feedbackType) {
    if (feedbackType === feedback.types.transactional)
      this.globalQueries = [
        ...this.globalQueries,
        { entityIds: this._statisticService.outletIds },
      ];
    else {
      this.globalQueries.forEach((element) => {
        if (element.hasOwnProperty('hotelId')) {
          this.globalQueries = [
            ...this.globalQueries,
            { entityIds: element.hotelId },
          ];
        }
      });
    }
  }

  /**
   * @function initFG To intialize NPS form group.
   */
  initFG(): void {
    this.npsFG = this.fb.group({
      documentType: ['csv'],
      documentActionType: ['Export All'],
      quickReplyActionFilters: [[]],
      npsChartType: ['bar'],
    });
  }

  onSelectedTabFilterChange(event) {
    this.tabFilterIdx = event.index;
    this.getNPSChartData();
  }

  getNPSDepartments() {
    this.loading = true;
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        {
          feedbackType: this.getFeedbackType(),
          department: 'TEST',
          order: sharedConfig.defaultOrder,
        },
      ]),
    };
    this.$subscription.add(
      this._statisticService.getDepartmentsStatistics(config).subscribe(
        (response) =>
          this.setTabFilterItems(response).then((res) => {
            this.getNPSChartData();
          }),
        ({ error }) =>
          this._snackbarService
            .openSnackBarWithTranslate({
              translateKey: 'messages.error.some_thing_wrong',
              priorityMessage: error?.message,
            })
            .subscribe(),
        () => (this.loading = false)
      )
    );
  }

  setTabFilterItems(data) {
    return new Promise((resolve) => {
      Object.keys(data.departments).forEach((departmentKey: string, i) => {
        if (
          !this.tabFilterItems.filter((item) => item.value === departmentKey)
            .length
        )
          this.tabFilterItems.push({
            label: data.departments[departmentKey],
            value: departmentKey,
            content: '',
            disabled: false,
            total: 0,
            lastPage: 0,
            chips: [
              {
                label: 'All',
                icon: '',
                value: 'ALL',
                total: 0,
                isSelected: true,
                type: '',
              },
            ],
          });
      });
      resolve(null);
    });
  }

  createChipsForDepartment(data) {
    return new Promise((resolve) => {
      const chips = [
        {
          label: 'All',
          icon: '',
          value: 'ALL',
          total: 0,
          isSelected: true,
          type: '',
        },
      ];
      Object.keys(data.services).forEach((serviceKey) => {
        chips.push({
          label: data.services[serviceKey],
          icon: '',
          value: serviceKey,
          total: 0,
          isSelected: false,
          type: 'initiated',
        });
      });
      resolve(chips);
    });
  }

  isQuickReplyFilterSelected(quickReplyFilter): boolean {
    return true;
  }

  /**
   * @function toggleQuickReplyFilter To handle the chip click for a tab.
   * @param quickReplyTypeIdx The chip index.
   * @param quickReplyType The chip type.
   */
  toggleQuickReplyFilter(quickReplyTypeIdx: number, quickReplyType): void {
    if (quickReplyTypeIdx == 0) {
      this.tabFilterItems[this.tabFilterIdx].chips.forEach((chip) => {
        if (chip.value !== 'ALL') {
          chip.isSelected = false;
        }
      });
      this.tabFilterItems[this.tabFilterIdx].chips[
        quickReplyTypeIdx
      ].isSelected = !this.tabFilterItems[this.tabFilterIdx].chips[
        quickReplyTypeIdx
      ].isSelected;
    } else {
      this.tabFilterItems[this.tabFilterIdx].chips[0].isSelected = false;
      this.tabFilterItems[this.tabFilterIdx].chips[
        quickReplyTypeIdx
      ].isSelected = !this.tabFilterItems[this.tabFilterIdx].chips[
        quickReplyTypeIdx
      ].isSelected;
    }
    this.updateQuickReplyActionFilters();
  }

  /**
   * @function updateQuickReplyActionFilters To set the selected chip values to the form.
   */
  updateQuickReplyActionFilters(): void {
    let value = [];
    this.tabFilterItems[this.tabFilterIdx].chips
      .filter((chip) => chip.isSelected)
      .forEach((d) => {
        value.push(d.value);
      });
    this.quickReplyActionFilters.patchValue(value);
    this.getNPSChartData();
  }

  /**
   * @function getSelectedQuickReplyFilters To get the selected chip list.
   * @returns The quick reply filter array.
   */
  getSelectedQuickReplyFilters() {
    if (this.npsFG.get('npsChartType').value == feedback.chartType.bar.value)
      return this.tabFilterItems.length
        ? this.tabFilterItems[this.tabFilterIdx].chips
            .filter((item) => item.isSelected == true)
            .map((item) => ({
              services: item.value,
            }))
        : '';
    return [{ services: 'ALL' }];
  }

  /**
   * @function setChartType The function to set chart type and refresh data.
   * @param value The chart type value.
   */
  setChartType(value: string) {
    this.npsFG.patchValue({ npsChartType: value });
    this.getNPSChartData();
  }

  /**
   * @function getNPSChartData To get NPS department chart data.
   */
  protected getNPSChartData(): void {
    this.loading = true;
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        {
          feedbackType: this.getFeedbackType(),
          order: sharedConfig.defaultOrder,
          department: this.tabFilterItems[this.tabFilterIdx].value,
        },
        ...this.getSelectedQuickReplyFilters(),
      ]),
    };
    this.$subscription.add(
      this._statisticService.getDepartmentsStatistics(config).subscribe(
        (response) => {
          this.npsChartData = new NPSDepartments().deserialize(
            response.npsStats
          );
          if (
            this.tabFilterItems[this.tabFilterIdx].chips.length == 1 &&
            this.npsFG.get('npsChartType').value == feedback.chartType.bar.value
          )
            this.createChipsForDepartment(response).then((res) => {
              this.tabFilterItems[this.tabFilterIdx].chips = res;
            });
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
            .subscribe(),
        () => (this.loading = false)
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
          feedbackType: this.getFeedbackType(),
          order: sharedConfig.defaultOrder,
          department: this.tabFilterItems[this.tabFilterIdx].value,
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

  getFeedbackType() {
    if (this.tabfeedbackType === undefined) {
      return this.globalFeedbackFilterType === this.feedbackConfig.types.both
        ? feedback.types.stay
        : this.globalFeedbackFilterType;
    }
    return this.tabfeedbackType === this.feedbackConfig.types.both
      ? feedback.types.transactional
      : this.tabfeedbackType;
  }

  /**
   * @function quickReplyActionFilters To get the quickReplyActionFilters control.
   */
  get quickReplyActionFilters(): FormControl {
    return this.npsFG.get('quickReplyActionFilters') as FormControl;
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}