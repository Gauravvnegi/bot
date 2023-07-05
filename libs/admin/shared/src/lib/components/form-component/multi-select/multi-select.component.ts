import { Component, Input } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { Option } from '../../../types/form.type';
import { FormComponent } from '../form.components';

@Component({
  selector: 'hospitality-bot-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss'],
})
export class MultiSelectComponent extends FormComponent {
  menuClass = 'p-multiselect-items-wrapper';
  searchInputClass = 'p-multiselect-filter';

  showHeader = true;
  showChips = true;
  maxSelectedLabels = 20;

  /**
   * @Input to change default date setting
   */
  @Input() set settings(value: MultiSelectSettings) {
    Object.entries(value)?.forEach(([key, value]) => {
      this[key] = value;
    });
  }

  constructor(public controlContainer: ControlContainer) {
    super(controlContainer);
  }

  dictionary: Record<string, string> = {};

  handleClear(value: string) {
    if (!this.isDisabled && this.inputControl.status !== 'DISABLED')
      this.inputControl.setValue(
        (this.inputControl.value as string[])?.filter((item) => item !== value)
      );
  }

  set options(input: Option[]) {
    this.menuOptions = input;
    this.dictionary = input?.reduce((prev, { label, value }) => {
      prev[value] = label;
      return prev;
    }, {});
  }
}

type MultiSelectSettings = {
  showHeader: boolean;
  maxSelectedLabels: number;
  showChips: boolean;
};
