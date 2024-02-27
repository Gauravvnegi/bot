import { Component, Input } from '@angular/core';
import { FormComponent } from '../form.components';
import {
  ControlContainer,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
@Component({
  selector: 'hospitality-bot-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss'],
})
export class TimePickerComponent extends FormComponent {
  timePickerFG: FormGroup;
  @Input() format: 'millisecond' | 'HH:MM' = 'HH:MM';

  constructor(
    public fb: FormBuilder,
    public controlContainer: ControlContainer
  ) {
    super(controlContainer);
  }

  ngOnInit(): void {
    this.initForm();
    this.listenChanges();
    this.initInputControl();
  }

  initForm() {
    this.timePickerFG = this.fb.group({
      hh: [null, [Validators.required]],
      mm: [null, [Validators.required]],
    });
  }

  listenChanges() {
    // TODO: Need to be refactor, for edit mode
    this.controlContainer.control
      .get(this.controlName)
      .valueChanges.subscribe((value) => {
        if (value) {
          const [HH, MM] = (this.format === 'HH:MM'
            ? value
            : this.millisecondsToRequiredFormat(+value)
          ).split(':');
          this.timePickerFG.patchValue(
            {
              hh: HH,
              mm: MM,
            },
            { emitEvent: false }
          );
        }
      });

    this.timePickerFG.valueChanges.subscribe(
      (value: { hh: string; mm: string }) => {
        const res = value.hh && value.mm ? this.getFormateTime(value) : '';
        this.controlContainer.control.get(this.controlName).patchValue(res);
      }
    );
  }

  /**
   * Handle conversion to time of input values
   * @param value hour and minutes
   * @returns formatted time
   */
  getFormateTime(value: { hh: string; mm: string }): string | number {
    if (this.format === 'millisecond') {
      const hoursToMilliseconds = +value.hh * 60 * 60 * 1000; // Convert hours to milliseconds
      const minutesToMilliseconds = +value.mm * 60 * 1000; // Convert minutes to milliseconds
      return hoursToMilliseconds + minutesToMilliseconds;
    } else {
      return `${value.hh}:${value.mm}`;
    }
  }

  /**
   * Convert the value to required input format
   * @param time time in milliseconds
   * @returns formatted time HH:MM
   */
  millisecondsToRequiredFormat(time: number) {
    const hours = Math.floor(time / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const formattedHours = ('0' + hours).slice(-2);
    const formattedMinutes = ('0' + minutes).slice(-2);
    return formattedHours + ':' + formattedMinutes;
  }

  /**
   * Handle validation: restrict key event
   * @param event Input Event
   * @param type HH or MM
   */
  handleKeyPress(event: Event, type: 'HH' | 'MM') {
    const targetValue = event.currentTarget['value'];
    const isNumber = event['keyCode'] > 46 && event['keyCode'] < 58;
    const value = +(targetValue + event['key']);
    if (
      (isNumber && type === 'HH' && value > 23) ||
      (type === 'MM' && value > 59)
    ) {
      event.stopPropagation();
      event.preventDefault();
    }
  }
}
