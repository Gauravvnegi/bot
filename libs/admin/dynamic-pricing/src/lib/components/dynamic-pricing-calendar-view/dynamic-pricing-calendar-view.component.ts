import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  epochWithoutTime,
  getListOfRandomLightColor,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { CGridData } from 'libs/admin/shared/src/lib/components/calendar-view/calendar-view.component';
import { IGEditEvent } from 'libs/admin/shared/src/lib/components/interactive-grid/interactive-grid.component';
import { Subscription } from 'rxjs';
import { DynamicPricingService } from '../../services/dynamic-pricing.service';
import {
  DaysType,
  DynamicPricingRequest,
} from '../../types/dynamic-pricing.types';

@Component({
  selector: 'hospitality-bot-dynamic-pricing-calendar-view',
  templateUrl: './dynamic-pricing-calendar-view.component.html',
  styleUrls: ['./dynamic-pricing-calendar-view.component.scss'],
})
export class DynamicPricingCalendarViewComponent implements OnInit, OnDestroy {
  loading = false;
  $subscription = new Subscription();

  seasons: {
    name: string;
    colorCode: string;
    fromDate: Date;
    toDate: Date;
    days: {
      label: string;
      value: DaysType;
    }[];
  }[] = [];

  colors = getListOfRandomLightColor(20);

  gridData: CGridData = {};

  constructor(
    private dynamicPricingService: DynamicPricingService,

    private fb: FormBuilder,
    private globalFilter: GlobalFilterService,
    private snackbarService: SnackBarService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.$subscription.add(
      this.dynamicPricingService
        .getDynamicPricingList({
          params: '?type=OCCUPANCY',
        })
        .subscribe(
          (res) => {
            console.log(res);
            this.loading = false;

            let dataObj: Record<number, DynamicPricingRequest[]> = {};

            res.configDetails.forEach((item, seasonIdx) => {
              const { fromDate, toDate, daysIncluded, name } = item;
              const colorCode = this.colors[seasonIdx];

              this.seasons.push({
                name,
                colorCode,
                days: daysIncluded.map((item) => ({
                  label: item.substring(0, 3),
                  value: item,
                })),
                fromDate: new Date(fromDate),
                toDate: new Date(toDate),
              });

              const startDate = this.getFormattedDate(fromDate);
              const endDate = this.getFormattedDate(toDate);

              console.log(epochWithoutTime(fromDate), epochWithoutTime(toDate));

              for (
                let currentEpoch = epochWithoutTime(fromDate);
                currentEpoch <= epochWithoutTime(toDate);
                currentEpoch += 86400000
              ) {
                this.gridData[currentEpoch] = {
                  bg: colorCode,
                  days: daysIncluded,
                };
              }

              const isSameYear = startDate.year === endDate.year;

              if (isSameYear) {
                dataObj = {
                  ...dataObj,
                  [startDate.year]: [...(dataObj[startDate.year] ?? []), item],
                };
              } else {
                const { lastDate, newDate } = this.getLastDateOfTheYear(
                  fromDate
                );

                const startItem = { ...item, toDate: lastDate };

                const endItem = { ...item, fromDate: newDate };

                const startItemStartDate = this.getFormattedDate(
                  startItem.fromDate
                );

                const endItemStartDate = this.getFormattedDate(
                  endItem.fromDate
                );

                dataObj = {
                  ...dataObj,
                  [startItemStartDate.year]: [
                    ...(dataObj[startItemStartDate.year] ?? []),
                    startItem,
                  ],
                  [endItemStartDate.year]: [
                    ...(dataObj[endItemStartDate.year] ?? []),
                    endItem,
                  ],
                };
              }
            });

            console.log(this.seasons, 'seasons');
          },
          () => {
            this.loading = false;
          }
        )
    );
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

  handleEdit(event: IGEditEvent) {
    console.log(event, 'onEdit event');

    if (event.id) {
      this.router.navigate(['create-season'], {
        queryParams: {
          seasonId: event.id,
        },
        relativeTo: this.route,
      });
    }
  }

  calculateSpace(value) {
    console.log('hello', value);
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
