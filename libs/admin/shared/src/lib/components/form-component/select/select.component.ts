import { Component, Output, EventEmitter } from '@angular/core';
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

  @Output() itemSelection: EventEmitter<any> = new EventEmitter<any>();

  constructor(public controlContainer: ControlContainer) {
    super(controlContainer);
    console.log(this.options)
  }

  handleItemChange(event: any): void {
    this.itemSelection.emit(event);
  }
}
