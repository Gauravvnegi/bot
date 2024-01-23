import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-tabbed-sidebar',
  templateUrl: './tabbed-sidebar.component.html',
  styleUrls: ['./tabbed-sidebar.component.scss'],
})
export class TabbedSidebarComponent implements OnInit {
  //event emitter
  @Output() onCloseSidebar = new EventEmitter<string>();

  @Output() onDateFilterChange = new EventEmitter<DateOption>();

  @Output() selectedTabFilterChange = new EventEmitter<TabChangeData>();
  @Output() onLoadMore = new EventEmitter<any>();

  @Input() loading: boolean = false;
  @Input() header: string = '';
  @Input() tabFilterItems: TabbedSidebarTabFilterItem[] = [];
  @Input() tabFilterIdx: number = 0;
  @Input() options: any[] = [];
  @Input() template: TemplateRef<any>;
  @Input() paginationDisabled: boolean = false;

  type = 'pre';
  selectedDateFilter: number;
  dates: DateOption[] = [];
  emptyMessage: {
    title: string;
    description: string;
    img: string;
  };
  selectedDateRange = this.dates[0];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.getDateFilter();

    this.selectedTabFilterChange.emit({
      index: this.tabFilterIdx,
      value: this.tabFilterItems[this.tabFilterIdx].value,
      from: this.dates[0].from,
      to: this.dates[0].to,
    });

    this.emptyMessage = this.tabFilterItems[this.tabFilterIdx]?.emptyMessage;
  }

  getDateFilter() {
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

  loadMore() {
    this.onLoadMore.emit(this.selectedDateRange);
  }

  /**
   * @function onTabFilterChange
   * @description on date filter change
   * @param date
   */
  onTabFilterChange(index: number) {
    this.selectedTabFilterChange.emit({
      index,
      value: this.tabFilterItems[index].value,
      from: this.dates[0].from,
      to: this.dates[0].to,
    });
    this.setEmptyMessage(index);
    this.selectedDateFilter = this.dates[0].date;
  }

  onSelectedDateRangeChange(date) {
    this.selectedDateRange = date;
    this.onDateFilterChange.emit(date);
  }

  /**
   * @function setEmptyMessage
   * @description set empty message
   * @param index
   * @returns void
   */
  setEmptyMessage(index) {
    this.emptyMessage = this.tabFilterItems[index].emptyMessage;
  }
}

export type TabbedSidebarTabFilterItem = {
  label: string;
  value: string;
  emptyMessage: {
    title: string;
    description: string;
    img: string;
  };
};

type TabChangeData = {
  index: number;
  value: string;
} & DateOption;

type DateOption = {
  day?: string;
  date?: number;
  from?: number;
  to?: number;
};

const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
