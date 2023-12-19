import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  Option,
  epochWithoutTime,
  generateArrayItemColor,
  getDayOfWeekFromEpoch,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import {
  CGridData,
  CGridDataRecord,
  CGridHoverData,
  CGridSelectedData,
} from 'libs/admin/shared/src/lib/components/calendar-view/calendar-view.component';
import { Subscription } from 'rxjs';
import { DynamicPricingService } from '../../services/dynamic-pricing.service';
import { ConfigType, DaysType } from '../../types/dynamic-pricing.types';
import { rulesRoutes } from '../../constants/dynamic-pricing.const';

type Season = {
  id: string;
  isActive: boolean;
  name: string;
  colorCode: string;
  fromDate: Date;
  toDate: Date;
  days: {
    label: string;
    value: DaysType;
  }[];
  type: ConfigType;
};

type ContentData = Partial<{
  name: string;
  isActive: boolean;
  id: string;
}>;

type AdditionalData = { type: ConfigType };
@Component({
  selector: 'hospitality-bot-dynamic-pricing-calendar-view',
  templateUrl: './dynamic-pricing-calendar-view.component.html',
  styleUrls: ['./dynamic-pricing-calendar-view.component.scss'],
})
export class DynamicPricingCalendarViewComponent implements OnInit, OnDestroy {
  loading = false;
  $subscription = new Subscription();

  highlightedRule: CGridData<AdditionalData>['id'] = '';

  useForm: FormGroup;

  gridData: CGridDataRecord<AdditionalData> = {};
  markDates: CGridDataRecord<AdditionalData> = {};

  occupancyData: Record<string, ContentData> = {};
  dayTriggerData: Record<string, ContentData> = {};
  inactiveRules: CGridData<AdditionalData>['id'][] = [];
  years: number[] = [];

  ruleOptions: Option<ConfigType>[] = [
    {
      label: 'Season',
      value: 'OCCUPANCY',
    },
    {
      label: 'Day triggers',
      value: 'DAY_TIME_TRIGGER',
    },
  ];

  selectedRuleIdx: number = 0;

  get selectedRuleType() {
    return this.ruleOptions[this.selectedRuleIdx].value;
  }

  tooltip: string;

  constructor(
    private dynamicPricingService: DynamicPricingService,

    private fb: FormBuilder,
    private globalFilter: GlobalFilterService,
    private snackbarService: SnackBarService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.useForm = this.fb.group({
      seasons: new FormArray([]),
    });
  }

  onRuleFilterChange(event) {
    this.selectedRuleIdx = event.index;
  }

  openOverlayPanel(event, value: string) {
    const occupancySeasonData = this.occupancyData[value];
    const dayTriggerSeasonData = this.dayTriggerData[value];

    const currentSeasonId = occupancySeasonData?.id;
    const dayTriggerSeasonId = dayTriggerSeasonData?.id;

    if (currentSeasonId || dayTriggerSeasonId) {
      // if (dayTriggerSeasonId) {
      //   this.content.dayTrigger = dayTriggerSeasonData;
      // } else {
      //   this.content.dayTrigger = { ...defaultContent };
      // }

      // if (currentSeasonId) {
      //   this.content.season = occupancySeasonData;
      // } else {
      //   this.content.season = { ...defaultContent };
      // }

      this.tooltip =
        (currentSeasonId ? `Season: ${occupancySeasonData.name}\n` : '') +
        (dayTriggerSeasonId ? `Day Trigger: ${dayTriggerSeasonData.name}` : '');

      // if (this.overlayPanel.overlayVisible) {
      //   // Close the existing overlay panel
      //   this.overlayPanel.hide();
      // }

      // Change the content or update content based on your needs

      // Open the overlay panel again
      // setTimeout(() => {
      //   this.overlayPanel.show(event);
      // }, 200);
    } else {
      // Close the overlay panel if there's no valid data
      // this.overlayPanel.hide();
      this.tooltip = '';
    }
  }

  closeOverlayPanel() {
    // this.overlayPanel.hide();
    this.tooltip = '';
  }

  handleHover(event: CGridHoverData) {
    event.type === 'enter'
      ? this.openOverlayPanel(event.event, event.value)
      : this.closeOverlayPanel();

    // this.showMenu = event.event;
    // console.log(event, 'event', this.showMenu);

    // event.type === 'enter' ? this.menu.show(event.event) : this.menu.hide();
  }

  scrollIntoView(id: string) {
    // const targetElement = document.getElementById(id);
    // targetElement.scrollIntoView({ behavior: 'smooth' });

    var container = document.getElementById('season-filter');
    var content = document.getElementById(id);

    // Calculate the offset of the content within the container
    var offset = content.offsetTop - container.offsetTop;

    container.scrollTo({
      top: offset,
      behavior: 'smooth',
    });
  }

  crateRulesForm(data: Season) {
    // Rules Value
    const fgData: Record<keyof Season, any> = {
      isActive: [data.isActive],
      name: [data.name],
      id: [data.id],
      colorCode: [data.colorCode],
      fromDate: [data.fromDate],
      toDate: [data.toDate],
      days: [data.days],
      type: [data.type],
    };

    const sFrom = this.fb.group(fgData);

    sFrom.valueChanges.subscribe((value: Season) => {
      this.$subscription.add(
        this.dynamicPricingService
          .changeRuleStatus(value.id, value.isActive, value.type)
          .subscribe((res) => {
            const isActive = res.status === 'ACTIVE';

            if (isActive) {
              const newInactiveRules = this.inactiveRules.filter(
                (item) => item !== res.id
              );
              this.inactiveRules = newInactiveRules;
            } else {
              /**
               * @todo - Inactive is now disappearing
               */
              const newInactiveRules = [...this.inactiveRules];
              newInactiveRules.push(res.id);
              this.inactiveRules = newInactiveRules;
            }

            this.snackbarService.openSnackBarAsText(
              `Season ${value.name} status updated successfully.`,
              '',
              {
                panelClass: 'success',
              }
            );
          })
      );
    });

    return sFrom;
  }

  ngOnInit(): void {
    this.loading = true;

    this.dynamicPricingService.getDynamicPricingListing().subscribe((rules) => {
      this.loading = false;

      const totalRules = rules.configDetails.length;

      rules.configDetails.forEach((item, seasonIdx) => {
        const { fromDate, toDate, daysIncluded, name, id, status, type } = item;
        const colorCode = generateArrayItemColor(
          seasonIdx,
          totalRules,
          type === 'DAY_TIME_TRIGGER' ? 'dark' : 'light'
        );

        const isActive = status === 'ACTIVE';

        this.rulesFA.push(
          this.crateRulesForm({
            id,
            name,
            type,
            isActive,
            colorCode,
            days: daysIncluded.map((item) => ({
              label: item.substring(0, 3),
              value: item,
            })),
            fromDate: new Date(fromDate),
            toDate: new Date(toDate),
          })
        );

        if (!isActive) this.inactiveRules.push(id);

        const startDate = this.getFormattedDate(fromDate);
        const endDate = this.getFormattedDate(toDate);

        for (
          let currentEpoch = epochWithoutTime(fromDate);
          currentEpoch <= epochWithoutTime(toDate);
          currentEpoch += 86400000
        ) {
          const { day } = getDayOfWeekFromEpoch(currentEpoch);

          const gridData: CGridData<AdditionalData> = {
            bg: colorCode,
            days: daysIncluded,
            id,
            type,
          };

          if (daysIncluded.includes(day)) {
            if (type === 'OCCUPANCY') {
              this.gridData[currentEpoch] = gridData;

              this.occupancyData[currentEpoch] = {
                id,
                name,
                isActive,
              };
            }

            if (type === 'DAY_TIME_TRIGGER') {
              this.dayTriggerData[currentEpoch] = {
                id,
                name,
                isActive: status === 'ACTIVE',
              };

              this.markDates[currentEpoch] = gridData;
            }
          }
        }

        const isSameYear = startDate.year === endDate.year;
        const hasStartYear = this.years.includes(startDate.year);
        const hasEndYear = this.years.includes(endDate.year);

        if (isSameYear) {
          if (!hasStartYear) {
            this.years.push(startDate.year);
          }
        } else {
          if (!hasStartYear) {
            this.years.push(startDate.year);
          }
          if (!hasEndYear) {
            this.years.push(endDate.year);
          }
        }

        this.years.sort();
      });
    });
  }

  get rulesFA() {
    return this.useForm.get('seasons') as FormArray;
  }

  getLastDaysOfMonthBetweenDates(fromDate: number, toDate: number) {
    const result = [];

    const currentDate = new Date(fromDate);

    while (currentDate <= new Date(toDate)) {
      const lastDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );
      result.push(lastDayOfMonth.getDate());

      // Move to the next month
      currentDate.setMonth(currentDate.getMonth() + 1, 1);
    }

    return result;
  }

  getLastDateOfTheYear(fromDate: number) {
    const fromYear = new Date(fromDate).getFullYear();

    const lastDayOfYearEpoch = new Date(
      fromYear,
      11,
      31,
      23,
      59,
      59,
      999
    ).getTime();

    const firstDayOfNextYearEpoch = new Date(fromYear + 1, 0, 1).getTime();

    return { lastDate: lastDayOfYearEpoch, newDate: firstDayOfNextYearEpoch };
  }

  handleHighlightOfSeason() {}

  highlightRule(data: CGridData<AdditionalData>) {
    // resetting highlighted rule if clicked on same rule
    if (data && data.id === this.highlightedRule) {
      this.highlightedRule = '';
    } else if (data) {
      // Setting highlighted rule
      this.selectedRuleIdx = this.ruleOptions.findIndex(
        (item) => item.value === data.type
      );
      this.highlightedRule = data.id;
      setTimeout(() => {
        this.scrollIntoView(this.highlightedRule);
      }, 200);
    } else {
      this.highlightedRule = '';
    }
  }

  onDateSelect(event: CGridSelectedData<AdditionalData>) {
    const seasonData = event.gridData;
    const markedData = event.markedData;
    if (seasonData && markedData) {
      this.highlightRule(
        this.ruleOptions[this.selectedRuleIdx].value === 'DAY_TIME_TRIGGER'
          ? markedData
          : seasonData
      );
    } else if (seasonData || markedData) {
      this.highlightRule(seasonData ?? markedData);
    }
  }

  getFormattedDate(epochDate: number) {
    const date = new Date(epochDate);

    // Set the date to the next month and move back one day (the last day of the current month)

    const monthDate = new Date(epochDate);
    monthDate.setMonth(date.getMonth() + 1, 0);

    // Extract day, month, and year
    return {
      day: date.getDate(),
      monthFullName: new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
        date
      ),
      monthAbbreviation: new Intl.DateTimeFormat('en-US', {
        month: 'short',
      }).format(date),
      year: date.getFullYear(),
      lastDateOfMonth: monthDate.getDate(),
    };
  }

  handleEdit(ruleId: string, type: ConfigType) {
    this.router.navigate([rulesRoutes[type], ruleId], {
      relativeTo: this.route,
    });
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
