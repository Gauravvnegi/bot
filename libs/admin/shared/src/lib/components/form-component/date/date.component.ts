import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { DateService } from '@hospitality-bot/shared/utils';
import { FormComponent } from '../form.components';

@Component({
  selector: 'hospitality-bot-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss'],
})
export class DateComponent extends FormComponent implements OnInit {
  dateValue: Date;

  /* Default Date Settings */
  enableTime = true;
  enableSeconds = false;
  hourFormat: 12 | 24 = 12;
  dateFormat = 'd/m/yy';
  readonlyInput = false;
  enableButtonBar = false;

  /**
   * @Input to change default date setting
   */
  @Input() set settings(value: DateSetting) {
    Object.entries(value)?.forEach(([key, value]) => {
      this[key] = value;
    });
  }

  /* To add Min and max date validation */
  @Input() minDate: Date;
  @Input() maxDate: Date;

  constructor(public controlContainer: ControlContainer) {
    super(controlContainer);
  }

  ngOnInit(): void {
    this.initInputControl();
    this.inputControl.valueChanges.subscribe((res) => {
      /* Epoch Date conversion to Date */
      this.dateValue = new Date(res);
    });
  }

  get modIconNgClasses() {
    return {
      ...this.iconNgClass,
      'pi-spin pi-spinner': this.isLoading,
      'pi-calendar': !this.isLoading,
    };
  }

  /**
   * @function onDateChange to handle the changes
   */
  onDateChange(date: Date) {
    // time zone to be handled
    const epochDate = DateService.convertDateToTimestamp(date) * 1000;
    this.inputControl.setValue(epochDate);
  }

  /**
   * @function markAsTouched to mark date input as touched
   */
  markAsTouched() {
    this.inputControl.markAsTouched();
  }
}

/**
 * @type DateSetting
 * @property translateKey Translation key whose value will be fetched from translation files.
 * @property readonlyInput To set date as non editable
 * @property enableButtonBar To add cta to calendar
 *
 */
export type DateSetting = {
  enableTime: boolean;
  enableSeconds: boolean;
  hourFormat: 12 | 24;
  dateFormat: string;
  readonlyInput: boolean;
  enableButtonBar: boolean;
  dateValue: Date;
  isDisabled: boolean;
};

/**
 * Date Format
 * d - day of month (no leading zero)
 * dd - day of month (two digit)
 * o - day of the year (no leading zeros)
 * oo - day of the year (three digit)
 * D - day name short
 * DD - day name long
 * m - month of year (no leading zero)
 * mm - month of year (two digit)
 * M - month name short
 * MM - month name long
 * y - year (two digit)
 * yy - year (four digit)
 * @ - Unix timestamp (ms since 01/01/1970)
 * ! - Windows ticks (100ns since 01/01/0001)
 * '...' - literal text
 * '' - single quote
 * anything else - literal text
 */
