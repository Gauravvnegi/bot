import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { globalFeedback } from '@hospitality-bot/admin/feedback';
import {
  AdminUtilityService,
  StatisticsService,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { DateService } from '@hospitality-bot/shared/utils';
import * as FileSaver from 'file-saver';
import { Subscription } from 'rxjs';
import { feedback } from '../../../constants/feedback';
import { NPSAcrossServices } from '../../../data-models/statistics.model';
import { Chip } from '../../../types/feedback.type';

@Component({
  selector: 'hospitality-bot-nps-across-services',
  templateUrl: './nps-across-services.component.html',
  styleUrls: [
    '../../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './nps-across-services.component.scss',
  ],
})
export class NpsAcrossServicesComponent implements OnInit {
  globalFeedbackConfig = globalFeedback;
  feedbackConfig = feedback;
  npsFG: FormGroup;
  documentTypes = [{ label: 'CSV', value: 'csv' }];
  $subscription: Subscription = new Subscription();
  selectedInterval: string;
  npsProgressData: NPSAcrossServices;
  dividerHeight: number = 0;

  tabFilterIdx: number = 0;

  tabFilterItems = [];

  documentActionTypes = [
    {
      label: `Export`,
      value: 'export',
      type: 'countType',
      defaultLabel: 'Export',
    },
  ];

  isOpened = false;
  globalQueries = [];
  progresses = {};
  progressLength = 0;

  progressValues = [-100, -80, -60, -40, -20, 0, 20, 40, 60, 80, 100];
  maxBarCount: number = 0;

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

  registerListeners() {
    this.listenForGlobalFilters();
  }

  listenForGlobalFilters() {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe(
        (data) => {
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
          this.getNPSServices();
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

  /**
   * @function initFG To intialize NPS form group.
   */
  initFG(): void {
    this.npsFG = this.fb.group({
      documentType: ['csv'],
      documentActionType: ['exportAll'],
      quickReplyActionFilters: [[]],
    });
  }

  /**
   * @function onSelectedTabFilterChange To handle the tab filter change.
   * @param event The material tab change event.
   */
  onSelectedTabFilterChange(event: MatTabChangeEvent): void {
    this.tabFilterIdx = event.index;
    this.getNPSServices();
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
    this.getNPSServices();
  }

  /**
   * @function initTabLabels To initialize the tab filters.
   * @param entities The chips for the tabs.
   * @param departments The array for department.
   */
  protected initTabLabels(
    entities: Array<Chip>,
    departments: Array<any>
  ): void {
    if (!this.tabFilterItems.length) {
      departments.forEach((data, i) => {
        let chips = [];
        if (data.key === 'FRONTOFFICE') {
          chips = entities;
          this.tabFilterIdx = i;
        }
        this.tabFilterItems.push({
          label: data.value,
          content: '',
          value: data.key,
          disabled: false,
          total: 0,
          chips,
          lastPage: 0,
        });
      });
    } else if (!this.tabFilterItems[this.tabFilterIdx].chips.length) {
      this.tabFilterItems[this.tabFilterIdx].chips = entities;
    }
  }

  /**
   * @function initProgressData To initialize the progress bar data.
   * @param entities The chips for the tabs.
   */
  protected initProgressData(entities: Object) {
    this.progresses = {};
    if (
      this.tabFilterItems[this.tabFilterIdx].chips.filter(
        (data) => data.value === 'ALL' && data.isSelected
      ).length
    ) {
      this.progresses = {
        ...this.progresses,
        ...entities,
      };
      this.maxBarCount = 0;
      Object.keys(entities).forEach((data) => {
        if (this.maxBarCount < entities[data].length) {
          this.maxBarCount = entities[data].length;
        }
      });
    } else {
      this.maxBarCount = 0;
      this.progressLength = 0;
      this.tabFilterItems[this.tabFilterIdx].chips.forEach((chip) => {
        if (chip.isSelected) {
          this.progressLength += 1;
          this.progresses = {
            ...this.progresses,
            [chip.value]: entities[chip.value],
          };
          if (entities[chip.value].length > this.maxBarCount) {
            this.maxBarCount = entities[chip.value].length;
          }
        }
      });
    }
  }

  /**
   * @function getSelectedQuickReplyFilters To get the selected chip list.
   * @returns The quick reply filter array.
   */
  getSelectedQuickReplyFilters() {
    return this.tabFilterItems.length
      ? this.tabFilterItems[this.tabFilterIdx].chips
          .filter((item) => item.isSelected == true)
          .map((item) => ({
            services: item.value,
          }))
      : '';
  }

  /**
   * @function getNPSServices To get the NPS services progress data.
   */
  protected getNPSServices(): void {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        {
          order: 'DESC',
          departments: this.tabFilterItems.length
            ? this.tabFilterItems[this.tabFilterIdx].value
            : 'FRONTOFFICE',
        },
        ...this.getSelectedQuickReplyFilters(),
      ]),
    };
    this.$subscription.add(
      this._statisticService.getServicesStatistics(config).subscribe(
        (response) => {
          this.npsProgressData = new NPSAcrossServices().deserialize(response);
          if (this.npsProgressData.services) {
            this.initTabLabels(
              this.npsProgressData.services,
              this.npsProgressData.departments
            );
          }
          this.initProgressData(this.npsProgressData.entities);
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

  /**
   * @function exportCSV To export NPS services CSV report data.
   */
  exportCSV() {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        {
          order: 'DESC',
          entityType: this.tabFilterItems[this.tabFilterIdx].value,
        },
        // ...this.getSelectedQuickReplyFilters(),
      ]),
    };
    this.$subscription.add(
      this._statisticService.exportOverallServicesCSV(config).subscribe(
        (response) => {
          FileSaver.saveAs(
            response,
            'NPS_Across_Services_export_' + new Date().getTime() + '.csv'
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

  /**
   * @function quickReplyActionFilters To get the quickReplyActionFilters control.
   */
  get quickReplyActionFilters(): FormControl {
    return this.npsFG.get('quickReplyActionFilters') as FormControl;
  }
}
