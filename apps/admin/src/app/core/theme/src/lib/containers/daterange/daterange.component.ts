import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
@Component({
  selector: 'hospitality-bot-daterange',
  templateUrl: './daterange.component.html',
  styleUrls: ['./daterange.component.scss'],
})
export class DaterangeComponent implements OnInit {
  @Output() onDateRangeFilter = new EventEmitter();
  @Output() removeVisibility = new EventEmitter();
  @Input() timezone: string;

  ranges: any;
  config;
  public daterange: any = {};

  ngOnInit(): void {
    this.initRangesAndConfig();
    this.onDateRangeFilter.next({
      end: this.getCurrentTime().endOf('day'),
      label: 'Today',
      start: this.getCurrentTime().startOf('day'),
    });
  }

  initRangesAndConfig() {
    this.ranges = {
      Yesterday: [
        this.getCurrentTime().subtract(1, 'days').startOf('day'),
        this.getCurrentTime().subtract(1, 'days').endOf('day'),
      ],
      Today: [
        this.getCurrentTime().startOf('day'),
        this.getCurrentTime().endOf('day'),
      ],
      Tommorow: [
        this.getCurrentTime().add(1, 'days').startOf('day'),
        this.getCurrentTime().add(1, 'days').endOf('day'),
      ],
      'Last 7 Days': [
        this.getCurrentTime().subtract(6, 'days').startOf('day'),
        this.getCurrentTime(),
      ],
      'This Week': [
        this.getCurrentTime().startOf('week'),
        this.getCurrentTime().endOf('week'),
      ],
      'Next 7 Days': [
        this.getCurrentTime().add(1, 'day').startOf('day'),
        this.getCurrentTime().add(7, 'days').endOf('day'),
      ],
      'Last 30 Days': [
        this.getCurrentTime().subtract(29, 'days').startOf('day'),
        this.getCurrentTime(),
      ],
      'This Month': [
        this.getCurrentTime().startOf('month'),
        this.getCurrentTime().endOf('month'),
      ],
      'Last Month': [
        this.getCurrentTime().subtract(1, 'month').startOf('month'),
        this.getCurrentTime().subtract(1, 'month').endOf('month'),
      ],
    };
    this.config = {
      locale: {
        format: 'DD MMM, YYYY',
      },
      alwaysShowCalendars: false,
      ranges: this.ranges,
    };
  }

  getCurrentTime() {
    return moment().utcOffset(this.timezone);
  }

  selectedDate(date) {
    this.onDateRangeFilter.next(date);
  }
  onFocus() {
    this.removeVisibility.emit();
  }
}
