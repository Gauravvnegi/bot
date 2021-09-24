import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { StatisticsService } from '../../services/statistics.service';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { NPSTouchpoints } from '../../data-models/statistics.model';
import { Subscription } from 'rxjs';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';
import * as FileSaver from 'file-saver';
import { DateService } from 'libs/shared/utils/src/lib/date.service';

@Component({
  selector: 'hospitality-bot-nps-across-touchpoints',
  templateUrl: './nps-across-touchpoints.component.html',
  styleUrls: [
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './nps-across-touchpoints.component.scss',
  ],
})
export class NpsAcrossTouchpointsComponent implements OnInit {
  isOpened = false;
  npsFG: FormGroup;
  $subscription: Subscription = new Subscription();
  selectedInterval: string;
  npsProgressData: NPSTouchpoints;
  progresses: any = [];
  loading = false;
  documentTypes = [
    { label: 'CSV', value: 'csv' },
    // { label: 'EXCEL', value: 'excel' },
    // { label: 'PDF', value: 'pdf' },
  ];
  progressValues = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  tabFilterIdx: number = 0;

  documentActionTypes = [
    {
      label: `Export`,
      value: 'export',
      type: 'countType',
      defaultLabel: 'Export',
    },
  ];
  tabFilterItems = [];
  globalQueries;

  constructor(
    private fb: FormBuilder,
    private _adminUtilityService: AdminUtilityService,
    private _statisticService: StatisticsService,
    private _globalFilterService: GlobalFilterService,
    private _snackbarService: SnackBarService,
    private dateService: DateService
  ) {}

  ngOnInit(): void {
    this.initFG();
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
        ({ error }) => {
          this._snackbarService.openSnackBarAsText(error.message);
        }
      )
    );
  }

  initFG(): void {
    this.npsFG = this.fb.group({
      documentType: ['csv'],
      documentActionType: ['exportAll'],
      quickReplyActionFilters: [[]],
      time: [false],
    });
  }

  onSelectedTabFilterChange(event) {
    this.tabFilterIdx = event.index;
    this.getNPSServices();
  }

  isQuickReplyFilterSelected(quickReplyFilter) {
    // const index = this.quickReplyTypes.indexOf(offer);
    // return index >= 0;
    return true;
  }

  toggleQuickReplyFilter(quickReplyTypeIdx, quickReplyType) {
    if (this.time.value) {
      this.tabFilterItems[this.tabFilterIdx].chips.forEach((element, i) => {
        if (i === quickReplyTypeIdx) {
          element.isSelected = true;
        } else {
          element.isSelected = false;
        }
      });
    } else {
      // this.tabFilterItems[this.tabFilterIdx].chips[
      //   quickReplyTypeIdx
      // ].isSelected = !this.tabFilterItems[this.tabFilterIdx].chips[
      //   quickReplyTypeIdx
      // ].isSelected;
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
    }
    this.updateQuickReplyActionFilters();
  }

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

  private initTabLabels(departments, chips): void {
    if (!this.tabFilterItems.length) {
      departments.forEach((data, i) => {
        if (data.key === 'FRONTOFFICE') {
          this.tabFilterIdx = i;
        }
        this.tabFilterItems.push({
          label: data.value,
          content: '',
          value: data.key,
          disabled: false,
          total: 0,
          chips: chips[data.key] || [],
        });
      });
    } else if (!this.tabFilterItems[this.tabFilterIdx].chips.length) {
      this.tabFilterItems[this.tabFilterIdx].chips =
        chips[this.tabFilterItems[this.tabFilterIdx].value];
    }
  }

  getSelectedQuickReplyFilters() {
    return this.tabFilterItems.length
      ? this.tabFilterItems[this.tabFilterIdx].chips
          .filter((item) => item.isSelected == true)
          .map((item) => ({
            touchpoints: item.value,
          }))
      : '';
  }

  private getNPSServices(): void {
    this.loading = true;
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        {
          departments: this.tabFilterItems.length
            ? this.tabFilterItems[this.tabFilterIdx].value
            : 'FRONTOFFICE',
        },
        { time: this.time.value },
        ...this.getSelectedQuickReplyFilters(),
      ]),
    };
    this.$subscription.add(
      this._statisticService.getTouchpointStatistics(config).subscribe(
        (response) => {
          this.loading = false;
          this.npsProgressData = new NPSTouchpoints().deserialize(
            response,
            this.time.value
          );
          if (this.npsProgressData.departments) {
            this.initTabLabels(
              this.npsProgressData.departments,
              this.npsProgressData.chips
            );
          }
        },
        ({ error }) => {
          this.loading = false;
          this._snackbarService.openSnackBarAsText(error.message);
        }
      )
    );
  }

  exportCSV() {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        {
          order: 'DESC',
          entityType: this.tabFilterItems[this.tabFilterIdx].value,
        },
        { time: this.time.value },
        // ...this.getSelectedQuickReplyFilters(),
      ]),
    };
    this.$subscription.add(
      this._statisticService.exportOverallTouchpointsCSV(config).subscribe(
        (response) => {
          FileSaver.saveAs(
            response,
            'NPS_Across_Touchpoints_export_' + new Date().getTime() + '.csv'
          );
        },
        ({ error }) => {
          this._snackbarService.openSnackBarAsText(error.message);
        }
      )
    );
  }

  switchFilter(value) {
    this.getNPSServices();
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }

  get quickReplyActionFilters(): FormControl {
    return this.npsFG.get('quickReplyActionFilters') as FormControl;
  }

  get time() {
    return this.npsFG.get('time') as FormControl;
  }
}
