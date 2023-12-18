import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { DaysType, epochWithoutTime, weeks } from '../../utils/shared';
import { fullMonths } from '../../constants';
import { Option } from '../../types/form.type';

const disabledOpacity = 0.3;
const unselectedOpacity = 0.5;
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

  @Input() highlightId: CGridData['id'] = '';

  @Input() gridData: CGridDataRecord = {};

  @Input() inactiveIds: CGridData['id'][] = [];

  @Input() markDates: CGridMarkedRecord = {};

  @Input() tooltip: string = '';

  /**
   * @example M,T,W,T,F,S
   */
  colsInfo: Option<DaysType>[] = Array.from(
    { length: 37 },
    (_, index) => index
  ).map((item) => {
    const currentWeek = weeks[item % 7].value;
    return {
      label: currentWeek.charAt(0),
      value: currentWeek,
    };
  });

  rowsInfo = fullMonths.map((item) => ({
    label: item.substring(0, 3),
    value: item,
  }));

  monthIndices = Array.from({ length: 12 }, (_, index) => index);

  gridInfo: CGridInfo = {};

  content: Partial<{
    season: {
      id: string;
      name: string;
    };
  }> = {};

  get fontSize() {
    return this.size / 2 + 'px';
  }

  get height() {
    return this.size + 'px';
  }

  @Output() onDateSelect = new EventEmitter<CGridSelectedData>();
  @Output() onDateHover = new EventEmitter<CGridHoverData>();

  constructor() {}

  ngOnInit(): void {
    this.setGridInfo();
  }

  openOverlayPanel(event, value: CGridOption['value']) {
    this.onDateHover.emit({
      type: 'enter',
      value,
      event,
    });
  }

  closeOverlayPanel(event, value: CGridOption['value']) {
    this.onDateHover.emit({
      type: 'leave',
      value,
      event,
    });
  }

  getMarkedDatesStyle(value: CGridOption['value']) {
    const data = this.markDates[value];
    const show = !!data;
    return {
      color: show ? data.bg : 'none',
      borderColor: show ? data.bg : 'none',
      borderWidth: show ? '1px' : '0px',
    };
  }

  setGridInfo() {
    this.gridInfo = this.years.reduce((value, curr) => {
      return { ...value, [curr]: this.getCalendarInfo(curr) };
    }, {});
  }

  getStyles(value: CGridOption['value']) {
    const data = this.gridData[value];
    const show = !!data;
    const currentId = data?.id;
    const isHighlighted = !!this.highlightId;
    const isInactive = currentId && this.inactiveIds.includes(currentId);

    // data?.days.includes(this.colsInfo[gridDataIdx].value) && data?.bg;

    const opacity = isInactive ? disabledOpacity : 1;
    const unOpacity = isInactive ? disabledOpacity : unselectedOpacity;

    return {
      backgroundColor: show ? data.bg : 'none',
      opacity: isHighlighted
        ? show && currentId === this.highlightId
          ? opacity
          : unOpacity
        : opacity,
      height: this.height,
      minWidth: this.height,
      maxWidth: this.height,
      fontSize: this.size / 2.3 + 'px',
      cursor: show ? (isInactive ? 'not-allowed' : 'pointer') : 'default',
    };
  }

  onGridClick(value: CGridOption['value'], gridDataIdx: number) {
    const id = this.gridData[value]?.id;
    const selectedDate = +value;

    this.onDateSelect.emit({
      id: this.inactiveIds.includes(id) ? '' : id,
      selectedDate,
    });
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

export type CGridOption = Option<string, { date?: number }>;
export type CGridInfo = Record<number, CGridOption[][]>;
export type CGridDataRecord<TOptions = Record<string, any>> = Record<
  string,
  CGridData & TOptions
>;
export type CGridData = { bg: string; id: string } & Partial<{
  days: DaysType[];
}>;
export type CGridSelectedData = { id?: string; selectedDate: number };
export type CGridHoverData = {
  type?: 'enter' | 'leave';
  value: string; // date epoch
  event: MouseEvent;
};

export type CGridMarkedRecord = Record<string, CGridData>;
