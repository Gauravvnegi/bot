import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  Option,
  fullMonths,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { RoomTypes } from 'libs/admin/channel-manager/src/lib/models/bulk-update.models';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { BarPriceService } from '../../services/bar-price.service';
import { DynamicPricingService } from '../../services/dynamic-pricing.service';
import {
  IGCreateEvent,
  IGChangeEvent,
  IGEditEvent,
  IGRow,
  IGCol,
  IGValue,
} from 'libs/admin/shared/src/lib/components/interactive-grid/interactive-grid.component';
import { DynamicPricingResponse } from '../../types/dynamic-pricing.types';
import { ActivatedRoute, Router } from '@angular/router';
import { weeks } from '../../constants/revenue-manager.const';

type YearData = {
  year: number;
  data: IGValue[];
};

@Component({
  selector: 'hospitality-bot-dynamic-pricing-calendar-view',
  templateUrl: './dynamic-pricing-calendar-view.component.html',
  styleUrls: ['./dynamic-pricing-calendar-view.component.scss'],
})
export class DynamicPricingCalendarViewComponent implements OnInit, OnDestroy {
  activeStep = 0;
  allRooms: RoomTypes[];
  entityId: string;
  dynamicPricingFG: FormGroup;
  itemList: MenuItem[] = [
    { label: 'Occupancy' },
    { label: 'Day/Time Trigger' },
    // { label: 'Inventory Reallocation' },
  ];
  loading = false;
  $subscription = new Subscription();

  constructor(
    private barPriceService: BarPriceService,
    private dynamicPricingService: DynamicPricingService,
    private adminUtilityService: AdminUtilityService,
    private fb: FormBuilder,
    private globalFilter: GlobalFilterService,
    private snackbarService: SnackBarService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  heading = 'Update inventory';

  gridCols: IGCol[] = Array.from({ length: 31 }, (_, index) => index + 1);
  gridRows: IGRow[] = fullMonths;

  data: IGValue[] = [];
  years = [2023, 2024];
  yearsData: YearData[] = [];

  reset = true;

  rowsInfo = fullMonths.map((item) => ({
    label: item,
    value: item,
  }));

  colsInfo: Option[] = Array.from({ length: 37 }, (_, index) => index + 1).map(
    (item) => {
      const currentWeek = weeks[item % 7].label;
      return {
        label: currentWeek.charAt(0),
        value: currentWeek,
      };
    }
  );

  // get gridRows(): IGRow[] {
  //   return this.rowsInfo.map((item) => item.value);
  // }

  // get gridCols(): IGCol[] {
  //   return this.colsInfo.map((item) => item.value);
  // }

  ngOnInit(): void {
    this.entityId = this.globalFilter.entityId;
    this.loading = true;
    this.$subscription.add(
      this.dynamicPricingService
        .getDynamicPricingList({
          params: '?type=OCCUPANCY',
        })
        .subscribe(
          (res) => {
            let dataObj = {};

            res.configDetails.forEach((item) => {
              const startDate = this.getFormattedDate(item.fromDate);
              const endDate = this.getFormattedDate(item.toDate);

              const isSameYear = startDate.year === endDate.year;
              console.log(item.name, 'sss', isSameYear);

              if (isSameYear) {
                dataObj = {
                  ...dataObj,
                  [startDate.year]: [...(dataObj[startDate.year] ?? []), item],
                };

                console.log(item, '.isSameYear', startDate.year);
              } else {
                const { lastDate, newDate } = this.getLastDateOfTheYear(
                  item.fromDate
                );

                console.log(lastDate, newDate, 'newDate');

                const startItem = {
                  ...item,
                  toDate: lastDate,
                };

                const endItem = {
                  ...item,
                  fromDate: newDate,
                };

                console.log(startItem, endItem, 'endItem');

                const startItemStartDate = this.getFormattedDate(
                  startItem.fromDate
                );
                const endItemStartDate = this.getFormattedDate(newDate);

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

              console.log(dataObj, 'dataObj');
            });

            console.log(dataObj, 'dfinal');

            const finalYearData = new Array<YearData>();

            Object.entries(dataObj).forEach(
              ([key, value]: [
                string,
                DynamicPricingResponse['configDetails']
              ]) => {
                const resultYearData: YearData = {
                  year: +key,
                  data: [],
                };

                const finalData = new Array<IGValue>();

                value.forEach((item) => {
                  const startDate = this.getFormattedDate(item.fromDate);
                  const endDate = this.getFormattedDate(item.toDate);

                  const lastDates = this.getLastDaysOfMonthBetweenDates(
                    item.fromDate,
                    item.toDate
                  );

                  const startMonthIndex = this.gridRows.indexOf(
                    startDate.monthFullName
                  );
                  const endMonthIndex = this.gridRows.indexOf(
                    endDate.monthFullName
                  );

                  const itemArray = Array.from(
                    { length: endMonthIndex - startMonthIndex + 1 },
                    (_, index) => startMonthIndex + index
                  );

                  itemArray.forEach((monthIndex, index) => {
                    const isLastItem = index === itemArray.length - 1;
                    const isFirstItem = index === 0;
                    const gridData: IGValue = {
                      id: item.id,
                      startPos: isFirstItem ? startDate.day : 1,
                      endPos: isLastItem ? endDate.day : lastDates[index],
                      rowValue: this.gridRows[monthIndex],

                      content: item.name,
                      additionContent: item.daysIncluded
                        .map((item) => item.substring(0, 3))
                        .join(', '),
                    };

                    finalData.push(gridData);
                  });
                });

                resultYearData.data = [
                  ...finalData,
                  ...this.getNonInteractiveGrid(+key),
                ];

                finalYearData.push(resultYearData);
              }
            );

            this.yearsData = finalYearData;

            this.loading = false;
          },
          () => {
            this.loading = false;
          }
        )
    );
  }

  getNonInteractiveGrid(year: number) {
    const interactiveData = new Array<IGValue>();

    for (let month = 0; month < 12; month++) {
      const lastDayOfMonth = new Date(year, month + 1, 0);
      const lastDateOfMonth = lastDayOfMonth.getDate();
      if (lastDateOfMonth < 31)
        interactiveData.push({
          id: null,
          endPos: 31,
          startPos: lastDateOfMonth + 1,
          nonInteractive: true,
          rowValue: this.gridRows[month],
          colorCode: 'draft',
        });
    }

    return interactiveData;
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

  handleChange(event: IGChangeEvent) {
    console.log(event, 'onChange event');
  }

  handleCreate(event: IGCreateEvent) {
    console.log(event, 'onCreate event');
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

  handleReset() {
    this.loading = false;
    setTimeout(() => {
      // this.data = [...data];
      this.loading = false;
    }, 1500);
  }

  handleReinitialize() {
    this.reset = !this.reset;
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
