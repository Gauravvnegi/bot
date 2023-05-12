import { Component, Input } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { FormComponent } from '../form.components';

@Component({
  selector: 'hospitality-bot-text-area',
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.scss'],
})
export class TextAreaComponent extends FormComponent {
  /* Default Textarea Settings */
  autoResize = true;
  rows = 3;
  maxChar = 200;

  /**
   * @Input to change default date setting
   */
  @Input() set settings(value: TextAreaSettings) {
    Object.entries(value)?.forEach(([key, value]) => {
      this[key] = value;
    });
  }

  constructor(public controlContainer: ControlContainer) {
    super(controlContainer);
  }
}

export type TextAreaSettings = {
  autoResize: boolean;
  rows: number;
  maxChar: number;
};
