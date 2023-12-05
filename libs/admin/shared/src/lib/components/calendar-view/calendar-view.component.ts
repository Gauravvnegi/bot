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

  @Input() year = 2023;

  @Input() size = 25;

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

  gridInfo: Option<Date>[][] = [];

  constructor() {
    this.setGridInfo();
  }

  setGridInfo() {
    /**
     * 0 = January, 1 = February, ..., 11 = December
     * 0 = Sunday, 1 = Monday, ..., 6 = Saturday
     */
    const ddd = this.monthIndices.map((monthIdx) => {
      const startDayIdx = new Date(this.year, monthIdx, 1).getDay();
      const count = new Date(this.year, monthIdx + 1, 0).getDate();

      return this.colsInfo.map((_, idx) => {
        const isValid = idx >= startDayIdx && idx - startDayIdx < count;
        const res: Option<Date> = {
          label: (isValid ? idx + 1 - startDayIdx : 0).toString(),
          value: isValid
            ? new Date(this.year, monthIdx, idx - startDayIdx)
            : null,
          inactive: !isValid,
        };

        return res;
      });
    });

    this.gridInfo = ddd;

    console.log(ddd, 'ddd');
  }

  ngOnInit(): void {
    this.$subscription.add();
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
