import { Component, Input } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { Alignment } from '../../../types/form.type';
import { FormComponent } from '../form.components';

@Component({
  selector: 'hospitality-bot-toggle-switch',
  templateUrl: './toggle-switch.component.html',
  styleUrls: ['./toggle-switch.component.scss'],
})
export class ToggleSwitchComponent extends FormComponent {
  @Input() onLabel = 'Active';
  @Input() offLabel = 'Inactive';

  alignment: Alignment = 'horizontal';

  constructor(public controlContainer: ControlContainer) {
    super(controlContainer);
  }
}
