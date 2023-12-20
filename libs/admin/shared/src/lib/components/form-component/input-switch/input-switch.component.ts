import { Component, Input, OnInit } from '@angular/core';
import { FormComponent } from '../form.components';
import { ControlContainer, FormGroup } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-input-switch',
  templateUrl: './input-switch.component.html',
  styleUrls: ['./input-switch.component.scss'],
})
export class InputSwitchComponent extends FormComponent {
  onLabel: InputSwitchSetting['onLabel'];
  offLabel: InputSwitchSetting['offLabel'];

  constructor(public controlContainer: ControlContainer) {
    super(controlContainer);
  }

  /**
   * @Input to change default date setting
   */
  @Input() set settings(value: InputSwitchSetting) {
    Object.entries(value)?.forEach(([key, value]) => {
      this[key] = value;
    });
  }
}

/**
 * @type InputSwitchSetting
 * @property {onLabel} To show what is enabled (green)
 * @property {offLabel} If present then switch bg color will be red
 */
export type InputSwitchSetting = {
  onLabel: string;
  offLabel: string;
};
