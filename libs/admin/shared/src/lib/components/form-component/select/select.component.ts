import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  optionAlignment: 'vertical' | 'horizontal' = 'vertical';
  isAppendToBody: boolean = false;

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

  get selectDropDownClass() {
    return {
      ...this.inputNgClasses,
      'input-margin-top': this.floatInsideLabel,
      select__horizontal:
        this.optionAlignment === 'horizontal' && this.menuOptions?.length,
    };
  }

  get dropdownOption() {
    return this.menuOptions?.length
      ? this.menuOptions
      : [
          {
            label: 'No record found',
            value: 'No record found not to be selected',
            disabled: true,
          },
        ];
  }
}
