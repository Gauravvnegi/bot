import { Component, Output, EventEmitter, Input } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { FormComponent } from '../form.components';
import { MultiSelectSettings } from '../multi-select/multi-select.component';

@Component({
  selector: 'hospitality-bot-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent extends FormComponent {
  // menuClass = 'cdk-virtual-scroll-viewport';
  menuClass = 'p-dropdown-items-wrapper';
  searchInputClass = 'p-dropdown-filter';

  @Input() isGroupOptions: boolean = false; // To group options

  @Output() itemSelection: EventEmitter<any> = new EventEmitter<any>();

  constructor(public controlContainer: ControlContainer) {
    super(controlContainer);
  }

  /**
   * @Input to change default date setting
   */
  @Input() set settings(value: MultiSelectSettings) {
    Object.entries(value)?.forEach(([key, value]) => {
      this[key] = value;
    });
  }

  handleItemChange(event: any): void {
    this.itemSelection.emit(event);
  }
}
