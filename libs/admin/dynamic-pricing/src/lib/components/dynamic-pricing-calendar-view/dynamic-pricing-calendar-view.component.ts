import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { AdminUtilityService, fullMonths } from '@hospitality-bot/admin/shared';
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

const data: IGValue[] = [
  {
    id: 'RES000',
    content: 'Out left 105',
    startPos: 8,
    endPos: 10,
    rowValue: 105,
    colorCode: 'warning',
    icons: ['assets/svg/View.svg', 'assets/svg/copy.svg'],
    additionContent: 'BigOh private ltd.',
  },
  {
    id: 'RES01000',
    content: 'Out right 105',
    startPos: 19,
    endPos: 22,
    rowValue: 105,
    colorCode: 'active',
    icons: ['assets/svg/copy.svg'],
  },
  {
    id: 'RES001',
    content: 'Room not available',
    startPos: 14,
    endPos: 16,
    rowValue: 101,
    colorCode: 'draft',
    nonInteractive: true,
  },
  {
    id: 'RES002',
    content: 'Akash 101',
    startPos: 17,
    endPos: 19,
    rowValue: 101,
    colorCode: 'warning',
    icons: ['assets/svg/View.svg', 'assets/svg/copy.svg'],
    additionContent: 'BigOh private ltd.',
  },
  {
    id: 'RES003',
    content: 'Jag 101',
    startPos: 20,
    endPos: 21,
    rowValue: 101,
    colorCode: 'success',
    additionContent: 'BigOh private ltd.',
  },
  {
    id: 'RES004',
    content: 'Tony Stark 102',
    startPos: 10,
    endPos: 15,

    rowValue: 102,
    colorCode: 'success',
    icons: ['assets/svg/copy.svg'],
    additionContent: 'BigOh private ltd.',
  },
  {
    id: 'RES006',
    content: 'Steve Rogers 103',
    startPos: 11,
    endPos: 15,
    rowValue: 103,
    colorCode: 'active',
  },

  {
    id: 'RES0071',
    content: 'Pradeep 104',
    startPos: 11,
    endPos: 19,
    rowValue: 104,
    colorCode: 'inactive',
    icons: ['assets/svg/copy.svg', 'assets/svg/View.svg'],

    additionContent: 'BigOh private ltd.',
  },
  {
    id: 'RES008',
    content: 'Ayush 104',
    startPos: 19,
    endPos: 20,
    rowValue: 104,
    colorCode: 'active',
    additionContent: 'BigOh private ltd.',
  },
  {
    id: 'RES007',
    content: 'Ayush 104',
    startPos: 21,
    endPos: 30,
    rowValue: 104,
    colorCode: 'inactive',
  },
];

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
    private snackbarService: SnackBarService
  ) {}

  heading = 'Update inventory';

  gridCols: IGCol[] = Array.from({ length: 31 }, (_, index) => index + 1);
  gridRows: IGRow[] = fullMonths;

  data: IGValue[] = [];

  reset = true;

  rowsInfo = fullMonths.map((item) => ({
    label: item,
    value: item,
  }));

  colsInfo = Array.from({ length: 31 }, (_, index) => index + 1).map(
    (item) => ({
      label: item,
      value: item,
    })
  );

  // get gridRows(): IGRow[] {
  //   return this.rowsInfo.map((item) => item.value);
  // }

  // get gridCols(): IGCol[] {
  //   return this.colsInfo.map((item) => item.value);
  // }

  ngOnInit(): void {
    this.entityId = this.globalFilter.entityId;

    this.$subscription.add(
      this.dynamicPricingService
        .getDynamicPricingList({
          params: '?type=OCCUPANCY',
        })
        .subscribe((res) => {
          console.log(res);
          const finalData = new Array<IGValue>();

          res.configDetails.forEach((item) => {
            const startDate = this.getFormattedDate(item.fromDate);
            const endDate = this.getFormattedDate(item.toDate);

            const lastDates = this.getLastDaysOfMonthBetweenDates(
              item.fromDate,
              item.toDate
            );

            console.log(lastDates, 'getLastDaysOfMonthBetweenDates');

            const startMonthIndex = this.gridRows.indexOf(
              startDate.monthFullName
            );
            const endMonthIndex = this.gridRows.indexOf(endDate.monthFullName);

            const itemArray = Array.from(
              { length: endMonthIndex - startMonthIndex + 1 },
              (_, index) => startMonthIndex + index
            );

            itemArray.forEach((monthIndex, index) => {
              const isLastItem = index === itemArray.length - 1;
              const isFirstItem = index === 0;
              const gridData = {
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

          this.data = [...finalData, ...this.getNonInteractiveGrid(2024)];
        })
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
  }

  calculateSpace(value) {
    console.log('hello', value);
  }

  handleReset() {
    this.loading = false;
    setTimeout(() => {
      this.data = [...data];
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
