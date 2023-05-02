import { Component } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { FormComponent } from '../form.components';

@Component({
  selector: 'hospitality-bot-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent extends FormComponent {
  // menuClass = 'cdk-virtual-scroll-viewport';
  menuClass = 'p-dropdown-items-wrapper';
  searchInputClass = 'p-dropdown-filter';

  constructor(public controlContainer: ControlContainer) {
    super(controlContainer);
  }
}
