import { Component, Input } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { FormComponent } from '../form.components';

@Component({
  selector: 'hospitality-bot-input-number',
  templateUrl: './input-number.component.html',
  styleUrls: ['./input-number.component.scss'],
})
export class InputNumberComponent extends FormComponent {
  min: number;
  max: number;

  @Input() set settings(value: InputNumberSettings) {
    Object.entries(value)?.forEach(([key, value]) => {
      this[key] = value;
    });
  }

  constructor(public controlContainer: ControlContainer) {
    super(controlContainer);
  }

  // ngOnInit(): void {}

  // get control() {
  //   return this.controlContainer.control.get(this.controlName);
  // }

  incrementValue() {
    const currentValue = this.inputControl.value;
    const newValue = currentValue + 1;

    if (currentValue !== this.max || !this.max) {
      this.inputControl.setValue(newValue);
    }
  }

  decrementValue() {
    const currentValue = this.inputControl.value;
    const newValue = currentValue - 1;

    if (currentValue !== this.min || !this.min) {
      this.inputControl.setValue(newValue);
    }
  }
}

type InputNumberSettings = {
  min: number;
  max: number;
};
