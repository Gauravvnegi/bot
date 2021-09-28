import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { SnackBarService } from 'libs/shared/material/src';
import { DateService } from 'libs/shared/utils/src/lib/date.service';
import { Subscription } from 'rxjs';
import { NPOS } from '../../data-models/statistics.model';
import { StatisticsService } from 'libs/admin/shared/src/lib/services/feedback-statistics.service';

@Component({
  selector: 'hospitality-bot-point-of-sale',
  templateUrl: './point-of-sale.component.html',
  styleUrls: [
    './point-of-sale.component.scss',
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
  ],
})
export class PointOfSaleComponent implements OnInit {
  npsFG: FormGroup;
  $subscription = new Subscription();
  selectedInterval;
  globalQueries;
  stats: NPOS;
  documentActionTypes = [
    {
      label: `Export`,
      value: 'export',
      type: 'countType',
      defaultLabel: 'Export',
    },
  ];
  documentTypes = [{ label: 'CSV', value: 'csv' }];

  chips = [
    {
      label: 'Overall',
      icon: '',
      value: 'ALL',
      total: 0,
      isSelected: true,
    },
    {
      label: 'Staff',
      icon: '',
      value: 'STAFF',
      total: 0,
      isSelected: false,
      type: 'initiated',
    },
    {
      label: 'Cleanliness ',
      icon: '',
      value: 'CLEANLINESS',
      total: 0,
      isSelected: false,
      type: 'initiated',
    },
    {
      label: 'Pricing ',
      icon: '',
      value: 'PRICING',
      total: 0,
      isSelected: false,
      type: 'initiated',
    },
    {
      label: 'Quality ',
      icon: '',
      value: 'QUALITY',
      total: 0,
      isSelected: false,
      type: 'initiated',
    },
  ];

  tabFilterIdx: number = 0;

  tabFilterItems = [
    {
      label: 'All',
      content: '',
      value: 'ALL',
      disabled: false,
      total: 0,
      chips: this.chips,
    },
  ];

  percentValue = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
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
    this.registerListeners();
  }

  initFG() {
    this.npsFG = this.fb.group({
      documentType: ['csv'],
      documentActionType: ['export'],
      quickReplyActionFilters: [[]],
    });
  }

  registerListeners() {
    this.listenForGlobalFilters();
    this.listenForOutletChanged();
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
          this.getStats();
        },
        ({ error }) => {
          this._snackbarService.openSnackBarAsText(error.message);
        }
      )
    );
  }

  listenForOutletChanged() {
    this._statisticService.outletChange.subscribe((response) => {
      if (response) {
        this.globalQueries[this.globalQueries.length - 1] = {
          outletsIds: this._statisticService.outletIds,
        };
        this.getStats();
      }
    });
  }

  getStats() {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams(this.globalQueries),
    };
    this.$subscription.add(
      this._statisticService.getPOSStats(config).subscribe((response) => {
        this.stats = new NPOS().deserialize(response);
        if (this.tabFilterItems.length === 1) {
          this.addFilterItems();
        }
      })
    );
  }

  addFilterItems() {
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

  onSelectedTabFilterChange(event) {
    this.tabFilterIdx = event.index;
    this.handleLocalTabChange();
  }

  handleLocalTabChange() {
    this.globalQueries[this.globalQueries.length - 1] = {
      outletsIds:
        this.tabFilterIdx === 0
          ? this._statisticService.outletIds
          : [this._statisticService.outletIds[this.tabFilterIdx - 1]],
    };
    this.getStats();
  }

  isQuickReplyFilterSelected(quickReplyFilter) {
    // const index = this.quickReplyTypes.indexOf(offer);
    // return index >= 0;
    return true;
  }

  toggleQuickReplyFilter(quickReplyTypeIdx, quickReplyType) {
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

  updateQuickReplyActionFilters(): void {
    let value = [];
    this.tabFilterItems[this.tabFilterIdx].chips
      .filter((chip) => chip.isSelected)
      .forEach((d) => {
        value.push(d.value);
      });
    this.quickReplyActionFilters.patchValue(value);
  }

  exportCSV() {}

  get quickReplyActionFilters(): FormControl {
    return this.npsFG.get('quickReplyActionFilters') as FormControl;
  }
}
