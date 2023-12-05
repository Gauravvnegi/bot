import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  Option,
  epochWithoutTime,
  fullMonths,
} from '@hospitality-bot/admin/shared';
import { Subscription } from 'rxjs';

export type DaysType =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export const weeks: Option<DaysType>[] = [
  { label: 'Sun', value: 'SUNDAY' },
  { label: 'Mon', value: 'MONDAY' },
  { label: 'Tue', value: 'TUESDAY' },
  { label: 'Wed', value: 'WEDNESDAY' },
  { label: 'Thu', value: 'THURSDAY' },
  { label: 'Fri', value: 'FRIDAY' },
  { label: 'Sat', value: 'SATURDAY' },
];

export type CGridOption = Option<string, { date?: number }>;
export type CGridInfo = Record<number, CGridOption[][]>;
export type CGridData = Record<
  string,
  Partial<{ bg: string; days: DaysType[] }>
>;

@Component({
  selector: 'hospitality-bot-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss'],
})
export class CalendarViewComponent implements OnInit, OnDestroy {
  $subscription = new Subscription();

  @Input() years = [2023, 2024, 2025];

  @Input() size = 25;

  @Input() calendarWidth: 'max-content';

  rowsInfo = fullMonths.map((item) => ({
    label: item.substring(0, 3),
    value: item,
  }));

  @Input() gridData: CGridData = {};

  /**
   * @example M,T,W,T,F,S
   */
  colsInfo: Option<DaysType>[] = Array.from(
    { length: 37 },
    (_, index) => index + 1
  ).map((item) => {
    const currentWeek = weeks[item % 7].value;
    return {
      label: currentWeek.charAt(0),
      value: currentWeek,
    };
  });

  monthIndices = Array.from({ length: 12 }, (_, index) => index);

  gridInfo: CGridInfo = {};

  get fontSize() {
    return this.size / 2 + 'px';
  }

  get height() {
    return this.size + 'px';
  }

  constructor() {}

  ngOnInit(): void {
    this.setGridInfo();
  }

  setGridInfo() {
    this.gridInfo = this.years.reduce((value, curr) => {
      return { ...value, [curr]: this.getCalendarInfo(curr) };
    }, {});

    console.log(this.gridInfo);
  }

  getStyles(value: string, gridDataIdx: number) {
    const data = this.gridData[value];

    const showBg =
      data?.days.includes(this.colsInfo[gridDataIdx].value) && data?.bg;

    return {
      backgroundColor: showBg ? data.bg : 'none',
      height: this.height,
      minWidth: this.height,
      maxWidth: this.height,
      fontSize: this.fontSize,
    };
  }

  getCalendarInfo(year: number) {
    /**
     * 0 = January, 1 = February, ..., 11 = December
     * 0 = Sunday, 1 = Monday, ..., 6 = Saturday
     */
    return this.monthIndices.map((monthIdx) => {
      const startDayIdx = new Date(year, monthIdx, 1).getDay();
      const count = new Date(year, monthIdx + 1, 0).getDate();

      return this.colsInfo.map((_, idx) => {
        const isValid = idx >= startDayIdx && idx - startDayIdx < count;
        const value = epochWithoutTime(
          new Date(year, monthIdx, idx - startDayIdx + 1).getTime()
        );
        const res: CGridOption = {
          label: (isValid ? idx + 1 - startDayIdx : 0).toString(),
          value: isValid ? `${value}` : null,
          inactive: !isValid,
        };

        return res;
      });
    });
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
