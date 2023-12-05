import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Option, fullMonths } from '@hospitality-bot/admin/shared';
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

  /**
   * @example M,T,W,T,F,S
   */
  colsInfo: Option[] = Array.from({ length: 37 }, (_, index) => index + 1).map(
    (item) => {
      console.log('week item: ', item);
      const currentWeek = weeks[item % 7].label;
      return {
        label: currentWeek.charAt(0),
        value: currentWeek,
      };
    }
  );

  monthIndices = Array.from({ length: 12 }, (_, index) => index);

  gridInfo: Record<number, Option<Date>[][]> = {};

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

    console.log(this.gridInfo, 'gridInfo');
    console.log(this.years, 'years');
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
        const res: Option<Date> = {
          label: (isValid ? idx + 1 - startDayIdx : 0).toString(),
          value: isValid ? new Date(year, monthIdx, idx - startDayIdx) : null,
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
