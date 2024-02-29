import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'hospitality-bot-date-group-filter',
  templateUrl: './date-group-filter.component.html',
  styleUrls: ['./date-group-filter.component.scss'],
})
export class DateGroupFilterComponent implements OnInit {
  @Output() onDateFilterChange = new EventEmitter<DateFilterOption>();

  constructor() {
    this.initDateFilterOptions();
  }

  dates: DateFilterOption[] = [];
  selectedDateFilter: number;
  selectedDateRange;
  _activeIndex: number = 0;

  @Input() set activeIndex(value) {
    this._activeIndex = value;
    this.selectedDateFilter = this.dates[value].date;
    this.onDateFilterChange.emit(this.dates[value]);
  }

  ngOnInit(): void {
    if (this._activeIndex === undefined) {
      this.initDateFilterOptions();
      this.onDateFilterChange.emit(this.dates[0]);
    }
  }

  onSelectedDateRangeChange(date, index: number): void {
    this.activeIndex = index;
  }

  initDateFilterOptions() {
    this.initDate(new Date().getTime(), 5);
    this.selectedDateFilter = this.dates[0].date;
  }

  /**
   * @function initDate
   * @description initialize date
   * @param startDate
   * @param limit
   */
  initDate(startDate: number, limit: number) {
    const dates = [];
    const currentDate = new Date(startDate);

    for (let i = 0; i < limit; i++) {
      const nextDate = new Date(currentDate);
      nextDate.setDate(currentDate.getDate() + i);
      const day = nextDate.getDay();

      const startTime = new Date(nextDate);
      startTime.setHours(0, 0, 0, 0); // Set to midnight (12:00 AM)
      const endTime = new Date(nextDate);
      endTime.setHours(23, 59, 59, 999); // Set to 11:59:59 PM

      const data = {
        day: daysOfWeek[day].substring(0, 3),
        date: nextDate.getDate(),
        from: startTime.getTime(),
        to: endTime.getTime(),
      };
      dates.push(data);
    }
    this.dates = dates;
  }
}

const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export type DateFilterOption = {
  day?: string;
  date?: number;
  from?: number;
  to?: number;
};
