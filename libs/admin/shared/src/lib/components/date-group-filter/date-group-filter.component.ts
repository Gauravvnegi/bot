import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'hospitality-bot-date-group-filter',
  templateUrl: './date-group-filter.component.html',
  styleUrls: ['./date-group-filter.component.scss'],
})
export class DateGroupFilterComponent implements OnInit {
  @Output() onDateFilterChange = new EventEmitter<{
    data: DateFilterOption;
    index: number;
  }>();

  dates: DateFilterOption[] = [];
  selectedDateFilter: number;
  _activeIndex: number;

  @Input() set activeIndex(value: number) {
    if (this._activeIndex !== value) {
      this._activeIndex = value;
      this.updateSelectedDateFilter(value);
    }
  }

  ngOnInit(): void {
    this.initDateFilterOptions();
  }

  onSelectedDateRangeChange(date: DateFilterOption, index: number): void {
    this._activeIndex = index;
    this.updateSelectedDateFilter(index);
  }

  private updateSelectedDateFilter(index: number): void {
    this.selectedDateFilter = this.dates[index]?.date;
    this.onDateFilterChange.emit({ data: this.dates[index], index });
  }

  private initDateFilterOptions(): void {
    const startDate = new Date().getTime();
    const limit = 5;
    const dates: DateFilterOption[] = [];

    for (let i = 0; i < limit; i++) {
      const currentDate = new Date(startDate + i * 24 * 60 * 60 * 1000); // Increment by a day
      const dayOfWeek = currentDate.toLocaleDateString('en-US', {
        weekday: 'short',
      });
      const startTime = new Date(currentDate);
      startTime.setHours(0, 0, 0, 0);
      const endTime = new Date(currentDate);
      endTime.setHours(23, 59, 59, 999);

      dates.push({
        day: dayOfWeek,
        date: currentDate.getDate(),
        from: startTime.getTime(),
        to: endTime.getTime(),
      });
    }

    this.dates = dates;
    this.selectedDateFilter = this.dates[0]?.date;
    this.onDateFilterChange.emit({ data: this.dates[0], index: 0 });
  }
}

export type DateFilterOption = {
  day: string;
  date: number;
  from: number;
  to: number;
};
