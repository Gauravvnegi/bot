import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { FormComponent } from '../form.components';

@Component({
  selector: 'hospitality-bot-input-number',
  templateUrl: './input-number.component.html',
  styleUrls: ['./input-number.component.scss'],
})
export class InputNumberComponent extends FormComponent implements OnInit {
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

  ngOnInit(): void {}

  get control() {
    return this.controlContainer.control.get(this.controlName);
  }

  incrementValue() {
    const currentValue = this.control.value;
    const newValue = currentValue + 1;

    if (currentValue !== this.max || !this.max) {
      this.control.setValue(newValue);
    }
  }

  decrementValue() {
    const currentValue = this.control.value;
    const newValue = currentValue - 1;

    if (currentValue !== this.min || !this.min) {
      this.control.setValue(newValue);
    }
  }
}

type InputNumberSettings = {
  min: number;
  max: number;
};
