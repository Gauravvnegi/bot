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
import * as FileSaver from 'file-saver';
import { HotelDetailService } from 'libs/admin/shared/src/lib/services/hotel-detail.service';
import { DateService } from 'libs/shared/utils/src/lib/date.service';
import { Subscription } from 'rxjs';
import { feedback } from '../../../constants/feedback';
import { NPOS, NPOSVertical } from '../../../data-models/statistics.model';
import { EntityState } from '../../../types/feedback.type';

@Component({
  selector: 'hospitality-bot-point-of-sale',
  templateUrl: './point-of-sale.component.html',
  styleUrls: [
    './point-of-sale.component.scss',
    '../../../../../../shared/src/lib/components/datatable/datatable.component.scss',
  ],
})
export class PointOfSaleComponent implements OnInit {
  globalFeedbackConfig = globalFeedback;
  npsFG: FormGroup;
  $subscription = new Subscription();
  selectedInterval;
  globalQueries;
  stats;
  branchId: string;
  chartTypes = feedback.chartTypes.pos;
  documentActionTypes = [
    {
      label: `Export`,
      value: 'export',
      type: 'countType',
      defaultLabel: 'Export',
    },
  ];
  chartType = 'compare';
  documentTypes = [{ label: 'CSV', value: 'csv' }];

  chips = [];

  tabFilterIdx: number = 0;

  tabFilterItems = [];

  percentValue = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  constructor(
    private fb: FormBuilder,
    private _adminUtilityService: AdminUtilityService,
    private _statisticService: StatisticsService,
    private _globalFilterService: GlobalFilterService,
    private _snackbarService: SnackBarService,
    private dateService: DateService,
    private _hotelDetailService: HotelDetailService
  ) {}

  ngOnInit(): void {
    this.initFG();
    this.registerListeners();
  }

  initFG(): void {
    this.npsFG = this.fb.group({
      documentType: ['csv'],
      documentActionType: ['export'],
      quickReplyActionFilters: [[]],
      chartType: ['compare'],
    });
  }

  registerListeners(): void {
    this.listenForGlobalFilters();
    this.listenForOutletChanged();
  }

  listenForGlobalFilters(): void {
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
          this.branchId = data['filter'].value.property.branchName;
          if (this.tabFilterItems.length === 0)
            this.setTabFilterItems(this.branchId);
          this.getStats();
        },
        ({ error }) => {
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
   * @function setTabFilterItems To set tab filter items.
   * @param branchId The hotel branch id.
   */
  setTabFilterItems(branchId: string): void {
    const outlets = this._hotelDetailService.hotelDetails.brands[0].branches.find(
      (branch) => branch['id'] == branchId
    ).outlets;
    this.tabFilterItems = [];
    outlets.forEach((outlet) => {
      if (this._statisticService.outletIds.find((d) => d === outlet.id)) {
        this.tabFilterItems.push({
          label: outlet.name,
          content: '',
          value: outlet.id,
          disabled: false,
          total: 0,
          chips: this.chips,
        });
      }
    });
  }

  listenForOutletChanged(): void {
    this._statisticService.outletChange.subscribe((response) => {
      if (response) {
        this.setTabFilterItems(this.branchId);
        this.getStats();
      }
    });
  }

  /**
   * @function getSelectedQuickReplyFilters To get selected chip list.
   * @returns The selected chips.
   */
  getSelectedQuickReplyFilters(): EntityState[] {
    return this.tabFilterItems[this.tabFilterIdx].chips
      .filter((item) => item.isSelected == true)
      .map((item) => ({
        entityState: item.value,
      }));
  }

  /**
   * @function getStats To get POS data fro the api.
   */
  getStats() {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams(
        this.tabFilterItems.length
          ? [
              ...this.globalQueries,
              {
                outletsIds: [this.tabFilterItems[this.tabFilterIdx].value],
                graphType: this.chartType === 'bar' ? 'vertical' : '',
              },
              ...this.getSelectedQuickReplyFilters(),
            ]
          : this.globalQueries
      ),
    };
    this.$subscription.add(
      this._statisticService.getPOSStats(config).subscribe((response) => {
        if (this.chartType === 'bar') {
          this.stats = new NPOSVertical().deserialize(response);
        } else {
          this.stats = new NPOS().deserialize(response);
        }
        if (this.tabFilterItems.length === 0 || this.chips.length === 0)
          this.addChipsToFilters();
      })
    );
  }

  /**
   * @function addChipsToFilters To set chips for tabs.
   */
  addChipsToFilters(): void {
    this.chips = [];
    if (this.stats.chipLabels.length > 1) {
      this.chips.push({
        label: 'Overall',
        icon: '',
        value: 'ALL',
        total: 0,
        isSelected: true,
      });
      this.stats.chipLabels.forEach((item) => {
        this.chips.push({
          label: item,
          icon: '',
          value: item,
          total: 0,
          isSelected: false,
          type: 'initiated',
        });
      });
    } else {
      this.stats.chipLabels.forEach((item) => {
        this.chips.push({
          label: item,
          icon: '',
          value: item,
          total: 0,
          isSelected: true,
          type: 'initiated',
        });
      });
    }
    if (this.tabFilterItems.length === 0) this.setTabFilterItems(this.branchId);
    else this.tabFilterItems[this.tabFilterIdx].chips = this.chips;
  }

  /**
   * @function addFilterItems To add tab filter data.
   */
  addFilterItems(): void {
    this.stats.data.forEach((item) =>
      this.tabFilterItems.push({
        label: item.label,
        content: '',
        value: item.label,
        disabled: false,
        total: 0,
        chips: this.chips,
      })
    );
  }

  /**
   * @function onSelectedTabFilterChange To handle selected tab filter change.
   * @param event The material tab event change.
   */
  onSelectedTabFilterChange(event: MatTabChangeEvent): void {
    this.tabFilterIdx = event.index;
    this.tabFilterItems[this.tabFilterIdx].chips = [];
    this.chips = [];
    this.getStats();
  }

  /**
   * @function toggleQuickReplyFilter To toggle chip selection.
   * @param quickReplyTypeIdx The index for selected chip.
   * @param quickReplyType The selected chip data.
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
    this.getStats();
  }

  /**
   * @function updateQuickReplyActionFilters To set selected chip data to form data.
   */
  updateQuickReplyActionFilters(): void {
    let value = [];
    this.tabFilterItems[this.tabFilterIdx].chips
      .filter((chip) => chip.isSelected)
      .forEach((d) => {
        value.push(d.value);
      });
    this.quickReplyActionFilters.patchValue(value);
  }

  /**
   * @function exportCSV To export CSV data for the POS data.
   */
  exportCSV(): void {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        {
          outletsIds: [this.tabFilterItems[this.tabFilterIdx].value],
        },
      ]),
    };

    this.$subscription.add(
      this._statisticService.exportPOSCSV(config).subscribe(
        (response) => {
          FileSaver.saveAs(
            response,
            'NPOS_' +
              this.tabFilterItems[this.tabFilterIdx].label +
              '_export_' +
              new Date().getTime() +
              '.csv'
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

  /**
   * @function setChartType To set chart type and load data for selected chart type.
   * @param chartType The selected chart type.
   */
  setChartType(chartType: string): void {
    this.chartType = chartType;
    this.getStats();
  }

  get quickReplyActionFilters(): FormControl {
    return this.npsFG.get('quickReplyActionFilters') as FormControl;
  }

  get services(): any[] {
    if (this.stats?.data) {
      return [
        ...new Map(
          []
            .concat(...this.stats.data.map((d) => d.services))
            .map((item) => [item.label, item])
        ).values(),
      ];
    }
    return [];
  }
}
