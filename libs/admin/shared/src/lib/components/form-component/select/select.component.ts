import { Component } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { FormComponent } from '../form.components';

@Component({
  selector: 'hospitality-bot-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent extends FormComponent {
  dropdownIcon = 'pi pi-chevron-down';

  set loading(value: boolean) {
    if (value) {
      this.dropdownIcon = 'pi pi-spin pi-spinner';
    } else {
      this.dropdownIcon = 'pi pi-chevron-down';
    }
  }

  constructor(public controlContainer: ControlContainer) {
    super(controlContainer);
  }
}
