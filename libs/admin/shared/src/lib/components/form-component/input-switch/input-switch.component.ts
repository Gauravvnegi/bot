import { Component, Input, OnInit } from '@angular/core';
import { FormComponent } from '../form.components';
import { ControlContainer, FormGroup } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-input-switch',
  templateUrl: './input-switch.component.html',
  styleUrls: ['./input-switch.component.scss'],
})
export class InputSwitchComponent extends FormComponent {
  @Input() set defaultValue(value: boolean) {
    if (this.controlContainer.control)
      this.controlContainer.control.patchValue({
        [this.controlName]: value,
      });
  }
  constructor(public controlContainer: ControlContainer) {
    super(controlContainer);
  }
}
