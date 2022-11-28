import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { SnackBarService } from '@hospitality-bot/shared/material';
import * as moment from 'moment';

@Component({
  selector: 'hospitality-bot-schedule-campaign',
  templateUrl: './schedule-campaign.component.html',
  styleUrls: ['./schedule-campaign.component.scss'],
})
export class ScheduleCampaignComponent implements OnInit {
  isSending = false;
  @Input() scheduleFG: FormGroup;
  timeList = [];
  @Output() onScheduleClose = new EventEmitter();
  minDate = new Date();
  constructor(
    private snackbarService: SnackBarService,
    private globalFilterService: GlobalFilterService
  ) {
    this.createTimeList(
      moment().utcOffset(this.globalFilterService.timezone).valueOf()
    );
  }

  ngOnInit(): void {}

  updateFormDate(value: any) {
    const currentTime = moment().utcOffset(this.globalFilterService.timezone);
    this.createTimeList(value);
    if (
      this.checkForSameDay(value) &&
      this.timeList.filter((time) => time.value === currentTime.valueOf())
        .length === 0
    ) {
      this.timeList = [
        {
          label: currentTime.format('h:mm A'),
          value: currentTime.valueOf(),
        },
        ...this.timeList,
      ];
      this.timeList.sort((a, b) => (a.value < b.value ? -1 : 1));
    }
    this.scheduleFG.patchValue({
      scheduleDate: value,
      time: this.checkForSameDay(value) ? currentTime.valueOf() : '',
    });
  }

  /**
   * @function close function to close send status on status false.
   */
  close() {
    this.onScheduleClose.emit({ status: false });
  }

  getDate() {
    return this.scheduleFG.get('scheduleDate').value
      ? `${this.scheduleFG.get('scheduleDate').value}`
      : 'Date';
  }

  checkEnableTime(time) {
    if (this.checkForSameDay(this.scheduleFG.get('scheduleDate').value)) {
      const hour = moment(time)
        .utcOffset(this.globalFilterService.timezone)
        .hour();
      const minute = moment(time)
        .utcOffset(this.globalFilterService.timezone)
        .minute();

      const currentHour = moment()
        .utcOffset(this.globalFilterService.timezone)
        .hour();
      const currentMinute = moment()
        .utcOffset(this.globalFilterService.timezone)
        .minute();

      if (hour < currentHour) return false;
      if (hour > currentHour) return true;
      if (hour === currentHour) {
        if (minute <= currentMinute) return false;
        else return true;
      }
    } else return true;
  }

  checkForSameDay(timestamp) {
    return (
      moment()
        .utcOffset(this.globalFilterService.timezone)
        .format('dd/MM/yyyy') ==
      moment(timestamp)
        .utcOffset(this.globalFilterService.timezone)
        .format('dd/MM/yyyy')
    );
  }

  scheduleCampaign() {
    if (this.scheduleFG.invalid) {
      this.snackbarService.openSnackBarAsText(
        'Please select the schedule time.'
      );
      this.scheduleFG.markAllAsTouched();
      return;
    }
    this.onScheduleClose.emit({
      status: true,
    });
  }

  createTimeList(timestamp) {
    this.timeList = [];
    let time = moment(timestamp)
      .utcOffset(this.globalFilterService.timezone)
      .startOf('day');
    const endOfDay = moment(timestamp)
      .utcOffset(this.globalFilterService.timezone)
      .add(1, 'days')
      .startOf('day');
    while (time.valueOf() !== endOfDay.valueOf()) {
      this.timeList.push({
        label: time.format('hh:mm A'),
        value: time.valueOf(),
      });
      time = time.add(30, 'minutes');
    }
  }

  onTimeChange(event) {
    this.scheduleFG.patchValue({
      time: moment(+event.value)
        .utcOffset(this.globalFilterService.timezone)
        .format('h:mm A'),
    });
  }
}
