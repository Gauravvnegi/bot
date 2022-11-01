import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'admin-notification-filter',
  templateUrl: './notification-filter.component.html',
  styleUrls: ['./notification-filter.component.scss'],
})
export class NotificationFilterComponent {
  @Input() filterData;
  @Input() filterFG: FormGroup;
  @Output() filterApplied = new EventEmitter();

  applyFilter() {
    const data = this.filterFG.getRawValue();
    data.fromDate = data.fromDate
      ? moment(data.fromDate).startOf('Day').unix() * 1000
      : data.fromDate;
    data.toDate = data.toDate
      ? moment(data.toDate).endOf('Day').unix() * 1000
      : data.toDate;
    this.filterApplied.emit({
      status: true,
      data,
    });
  }

  closeFilter() {
    this.filterApplied.emit({ status: false });
  }

  getFromMaxDate() {
    if (this.filterFG?.get('toDate').value) {
      return moment(this.filterFG?.get('toDate').value).endOf('Day');
    }
    return moment().startOf('Day');
  }

  getToMaxDate() {
    return moment().endOf('Day');
  }

  getToMinDate() {
    if (this.filterFG?.get('fromDate').value) {
      return moment(this.filterFG?.get('fromDate').value).endOf('Day');
    }
    return null;
  }
}
