import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import * as moment from 'moment';
@Component({
  selector: 'hospitality-bot-daterange',
  templateUrl: './daterange.component.html',
  styleUrls: ['./daterange.component.scss'],
})
export class DaterangeComponent implements OnInit {
  @Output() onDateRangeFilter = new EventEmitter();
  @Output() removeVisibility = new EventEmitter();

  ranges: any = {
    Yesterday: [
      moment().subtract(1, 'days').startOf('day'),
      moment().subtract(1, 'days').endOf('day'),
    ],
    Today: [moment().startOf('day'), moment().endOf('day')],
    Tommorow: [
      moment().add(1, 'days').startOf('day'),
      moment().add(1, 'days').endOf('day'),
    ],
    'Last 7 Days': [moment().subtract(6, 'days').startOf('day'), moment()],
    'This Week': [moment().startOf('week'), moment().endOf('week')],
    'Next 7 Days': [
      moment().add(1, 'day').startOf('day'),
      moment().add(7, 'days').endOf('day'),
    ],
    'Last 30 Days': [moment().subtract(29, 'days').startOf('day'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [
      moment().subtract(1, 'month').startOf('month'),
      moment().subtract(1, 'month').endOf('month'),
    ],
  };

  config = {
    locale: {
      format: 'DD MMM, YYYY',
    },
    alwaysShowCalendars: false,
    ranges: this.ranges,
  };

  public daterange: any = {};

  constructor() {}

  ngOnInit(): void {
    this.onDateRangeFilter.next({
      end: moment().endOf('day'),
      label: 'Today',
      start: moment().startOf('day'),
    });
  }

  selectedDate(date) {
    this.onDateRangeFilter.next(date);
  }
  onFocus() {
    this.removeVisibility.emit();
  }
}
