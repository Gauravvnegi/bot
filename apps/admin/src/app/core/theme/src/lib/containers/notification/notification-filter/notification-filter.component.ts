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
  startMinDate;
  startMaxDate = new Date();

  applyFilter() {
    const data = this.filterFG.getRawValue();
    data.fromDate = data.fromDate
      ? moment(data.fromDate).startOf('day').unix() * 1000
      : data.fromDate;
    data.toDate = data.toDate
      ? moment(data.toDate).endOf('day').unix() * 1000
      : data.toDate;
    data.status = Object.keys(data.status)
      .map((key) => (data.status[key] ? key.toUpperCase() : ''))
      .filter((item) => item !== '');
    this.filterApplied.emit({
      status: true,
      data,
    });
  }

  closeFilter(): void {
    this.filterApplied.emit({ status: false });
  }

  clearFilter(): void {
    this.filterFG.reset();
    this.filterFG.patchValue({
      fromDate: '',
      toDate: '',
    });
  }
}
