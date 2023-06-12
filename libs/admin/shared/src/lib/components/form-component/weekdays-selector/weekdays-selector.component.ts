import { Component, Input, Output } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup } from '@angular/forms';
import { FormComponent } from '../form.components';
import { EventEmitter } from 'events';

@Component({
  selector: 'hospitality-bot-weekdays-selector',
  templateUrl: './weekdays-selector.component.html',
  styleUrls: ['./weekdays-selector.component.scss'],
})
export class WeekdaysSelectorComponent extends FormComponent {
  @Input() days = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];
  @Input() label = 'Weekdays';
  @Output() weekChange = new EventEmitter();
  weekDayForm: FormGroup;

  constructor(
    public controlContainer: ControlContainer,
    private fb: FormBuilder
  ) {
    super(controlContainer);
  }

  ngOnInit(): void {
    this.weekDayForm = this.fb.group({
      allDays: false,
    });

    for (const day of this.days) {
      this.weekDayForm.addControl(day, this.fb.control(false));
    }

    this.listenChanges();
  }

  listenChanges() {
    this.weekDayForm.valueChanges.subscribe((changedDays) => {
      let selectedDays = [];
      Object.keys(changedDays).forEach((key) => {
        const value = changedDays[key];
        value && selectedDays.push(key);
      });

      changedDays.allDays && (selectedDays = [...this.days]);

      this.controlContainer.control.get(this.controlName).patchValue({
        [this.controlName]: selectedDays,
      });
    });
  }

  toggleSelectAll(): void {
    const allDaysValue = this.weekDayForm.get('allDays').value;

    for (const day of this.days) {
      this.weekDayForm.get(day).setValue(allDaysValue);
    }
  }

  toggleDaySelection(): void {
    const allDaysControl = this.weekDayForm.get('allDays');

    if (this.days.some((day) => !this.weekDayForm.get(day).value)) {
      allDaysControl.setValue(false);
    } else {
      allDaysControl.setValue(true);
    }
  }
}
