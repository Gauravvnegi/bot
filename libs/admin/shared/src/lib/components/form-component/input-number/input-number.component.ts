import { Component, Input, OnInit } from '@angular/core';
import { FormComponent } from '../form.components';
import { ControlContainer } from '@angular/forms';

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
}

type InputNumberSettings = {
  min: number;
  max: number;
};
