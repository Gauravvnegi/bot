import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { StatisticsService } from '../../services/statistics.service';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { NPSTouchpoints } from '../../data-models/statistics.model';
import { Subscription } from 'rxjs';

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

  progressValues = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  tabFilterIdx: number = 0;

  tabFilterItems = [];

  constructor(
    private fb: FormBuilder,
    private _adminUtilityService: AdminUtilityService,
    private _statisticService: StatisticsService,
    private _globalFilterService: GlobalFilterService
  ) {}

  ngOnInit(): void {
    this.initFG();
    this.getNPSServices();
  }

  initFG(): void {
    this.npsFG = this.fb.group({
      quickReplyActionFilters: [[]],
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
    this.tabFilterItems[this.tabFilterIdx].chips[
      quickReplyTypeIdx
    ].isSelected = !this.tabFilterItems[this.tabFilterIdx].chips[
      quickReplyTypeIdx
    ].isSelected;
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

  private initTabLabels(entities): void {
    if(!this.tabFilterItems.length) {
      entities.forEach((key, i) => {
        this.tabFilterItems.push({
          label: key,
          content: '',
          value: key,
          disabled: false,
          total: 0,
          chips: [
            { label: 'All', icon: '', value: 'ALL', total: 0, isSelected: true },
            {
              label: 'Checkin',
              icon: '',
              value: 'CHECKIN',
              total: 0,
              isSelected: false,
              type: 'initiated',
            },
            {
              label: 'Checkout',
              icon: '',
              value: 'CHECKOUT',
              total: 0,
              isSelected: false,
              type: 'initiated',
            },
          ],
        });
      });
    }
  }

  private initProgressData(Checkin, Checkout) {
    this.progresses.length = 0;
    this.progresses.push(this.mapCheckinData(Checkin));
    this.progresses.push(this.mapCheckoutData(Checkout));
  }

  private mapCheckinData(Checkin): Object {
    let obj = { label: 'Checkin' };
    obj['progressValues'] = [];
    Object.keys(Checkin).forEach((key) => {
      obj['progressValues'].push({
        label: Checkin[key].label,
        score: Checkin[key].score,
        colorCode: Checkin[key].colorCode,
      });
    });
    return obj;
  }

  private mapCheckoutData(Checkout): Object {
    let obj = { label: 'Checkout' };
    obj['progressValues'] = [];
    Object.keys(Checkout).forEach((key) => {
      obj['progressValues'].push({
        label: Checkout[key].label,
        score: Checkout[key].score,
        colorCode: Checkout[key].colorCode,
      });
    });
    return obj;
  }

  private getNPSServices(): void {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        let calenderType = {
          calenderType: this._adminUtilityService.getCalendarType(
            data['dateRange'].queryValue[0].toDate,
            data['dateRange'].queryValue[1].fromDate
          ),
        };
        this.selectedInterval = calenderType.calenderType;
        const queries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
          calenderType,
        ];

        const config = {
          queryObj: this._adminUtilityService.makeQueryParams(queries),
        };

        config.queryObj += `&states=${this.quickReplyActionFilters.value}`;
        config.queryObj += this.tabFilterItems.length
          ? `&departments=${this.tabFilterItems[this.tabFilterIdx].value}`
          : '';

        this.$subscription.add(
          this._statisticService
            .getTouchpointStatistics(config)
            .subscribe((response) => {
              this.npsProgressData = new NPSTouchpoints().deserialize(response);
              if (this.npsProgressData.entities) {
                this.initTabLabels(this.npsProgressData.entities);
              }
              this.initProgressData(
                this.npsProgressData.CHECKIN,
                this.npsProgressData.CHECKOUT
              );
            })
        );
      })
    );
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }

  get quickReplyActionFilters(): FormControl {
    return this.npsFG.get('quickReplyActionFilters') as FormControl;
  }
}
