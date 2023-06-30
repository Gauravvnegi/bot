import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormComponent } from '../form.components';
import { ControlContainer } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-input-number',
  templateUrl: './input-number.component.html',
  styleUrls: ['./input-number.component.scss'],
})
export class InputNumberComponent extends FormComponent implements OnInit {
  @ViewChild('inputField', { static: true }) inputField: ElementRef<HTMLInputElement>;

  min: number;
  max: number;

  @Input() set settings(value: InputNumberSettings) {
    Object.entries(value)?.forEach(([key, value]) => {
      this[key] = value;
    });
  }

  constructor(
    public controlContainer: ControlContainer,
  ) {
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
      this.focusInput();
    }
  }

  decrementValue() {
    const currentValue = this.control.value;
    const newValue = currentValue - 1;

    if (currentValue !== this.min || !this.min) {
      this.control.setValue(newValue);
      this.focusInput();
    }
  }

  focusInput() {
    const inputElement = this.inputField.nativeElement;
    debugger;
    inputElement.focus();
  }
}

type InputNumberSettings = {
  min: number;
  max: number;
};
