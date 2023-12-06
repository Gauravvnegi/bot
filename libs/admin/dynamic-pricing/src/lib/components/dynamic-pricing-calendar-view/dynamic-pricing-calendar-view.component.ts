import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  epochWithoutTime,
  getDayOfWeekFromEpoch,
  getListOfRandomLightColor,
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
import {
  DaysType,
  DynamicPricingRequest,
} from '../../types/dynamic-pricing.types';
// import { OverlayPanel } from 'primeng/overlaypanel';
// import { Menu } from 'primeng/menu';

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
};

type ContentData = {
  id: string;
  name: string;
  isActive: boolean;
};

type Content = Record<'season' | 'dayTrigger', ContentData>;

// const defaultContent: ContentData = {
//   id: '',
//   name: '',
//   isActive: true,
// };

@Component({
  selector: 'hospitality-bot-dynamic-pricing-calendar-view',
  templateUrl: './dynamic-pricing-calendar-view.component.html',
  styleUrls: ['./dynamic-pricing-calendar-view.component.scss'],
})
export class DynamicPricingCalendarViewComponent implements OnInit, OnDestroy {
  loading = false;
  $subscription = new Subscription();

  highlightedSeason: CGridData['id'] = '';

  useForm: FormGroup;

  colors = getListOfRandomLightColor(20);

  gridData: CGridDataRecord = {};

  occupancyData: CGridDataRecord<ContentData> = {};
  dayTriggerData: CGridDataRecord<ContentData> = {};
  inactiveSeasons: CGridData['id'][] = [];
  years: number[] = [];

  // content: Content = {
  //   season: { ...defaultContent },
  //   dayTrigger: { ...defaultContent },
  // };

  // showMenu: { clientX: number; clientY: number };
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
        (currentSeasonId ? `Season: ${occupancySeasonData.name}` : ' ') +
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

  createSeasonForm(data: Season) {
    const sFrom = this.fb.group({
      isActive: [data.isActive],
      name: [data.name],
      id: [data.id],
      colorCode: [data.colorCode],
      fromDate: [data.fromDate],
      toDate: [data.toDate],
      days: [data.days],
    });

    sFrom.valueChanges.subscribe((value) => {
      this.$subscription.add(
        this.dynamicPricingService
          .changeSeasonStatus(value.id, value.isActive, {
            params: '?type=OCCUPANCY',
          })
          .subscribe((res) => {
            const isActive = res.status === 'ACTIVE';

            if (isActive) {
              const newInactiveSeason = this.inactiveSeasons.filter(
                (item) => item !== res.id
              );
              this.inactiveSeasons = newInactiveSeason;
            } else {
              this.inactiveSeasons.push(res.id);
            }
          })
      );
    });

    return sFrom;
  }

  ngOnInit(): void {
    this.loading = true;

    this.dynamicPricingService.getAllDynamicPricingList().subscribe((res) => {
      const [occupancy, dayTrigger] = res;
      this.loading = false;

      occupancy.configDetails.forEach((item, seasonIdx) => {
        const { fromDate, toDate, daysIncluded, name, id, status } = item;
        const colorCode = this.colors[seasonIdx];

        const isActive = status === 'ACTIVE';

        this.seasonFA.push(
          this.createSeasonForm({
            id,
            name,
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

        if (!isActive) this.inactiveSeasons.push(id);

        const startDate = this.getFormattedDate(fromDate);
        const endDate = this.getFormattedDate(toDate);

        for (
          let currentEpoch = epochWithoutTime(fromDate);
          currentEpoch <= epochWithoutTime(toDate);
          currentEpoch += 86400000
        ) {
          const { day } = getDayOfWeekFromEpoch(currentEpoch);

          if (daysIncluded.includes(day)) {
            this.gridData[currentEpoch] = {
              bg: colorCode,
              days: daysIncluded,
              id,
            };

            this.occupancyData[currentEpoch] = {
              id,
              name,
              isActive,
            };
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

      dayTrigger.configDetails.forEach((item, seasonIdx) => {
        const { fromDate, toDate, daysIncluded, name, id, status } = item;

        for (
          let currentEpoch = epochWithoutTime(fromDate);
          currentEpoch <= epochWithoutTime(toDate);
          currentEpoch += 86400000
        ) {
          const { day } = getDayOfWeekFromEpoch(currentEpoch);

          if (daysIncluded.includes(day)) {
            this.dayTriggerData[currentEpoch] = {
              id,
              name,
              isActive: status === 'ACTIVE',
            };
          }
        }
      });
    });
  }

  get seasonFA() {
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

  onDateSelect(event: CGridSelectedData) {
    if (event.id === this.highlightedSeason && event.id !== '') {
      this.highlightedSeason = '';
    } else if (event.id) {
      this.highlightedSeason = event.id;
      this.scrollIntoView(this.highlightedSeason);
    } else {
      this.highlightedSeason = '';
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

  handleEdit(seasonId: string) {
    this.router.navigate(['create-season'], {
      queryParams: { seasonId },
      relativeTo: this.route,
    });
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
