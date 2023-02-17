import { Component, Input } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { map } from 'lodash';
import { MenuItem } from 'primeng/api';
import { Alignment, FormProps, InputVariant } from '../../types/form.type';

@Component({ template: '' })
export class FormComponent {
  float = false;
  isLoading = false;
  isSearch = false;
  variant: InputVariant = 'outlined';
  alignment: Alignment = 'horizontal';
  placeholder: string = '';
  showClear: false;
  height = '50px';
  fontSize = '16px';
  errorMessages: Record<string, string> = {
    required: 'This is required field',
  };
  isDisabled = false;

  @Input() label: string;
  @Input() controlName: string;
  @Input() options: MenuItem[];
  @Input() optionLabel: string = 'label';

  // set disabled
  @Input() set disabled(value: boolean) {
    this.isDisabled = value;
  }

  // set loading
  @Input() set loading(value: boolean) {
    this.isLoading = value;
  }

  // setting props
  @Input() set props(values: FormProps) {
    map(values, (val, key) => {
      this[key] = val;
    });
  }

  constructor(public controlContainer: ControlContainer) {}

  get error() {
    const errors = this.controlContainer.control.get(this.controlName).errors;
    if (errors && this.controlContainer.control.get(this.controlName).touched) {
      const priorityError = Object.keys(errors)[0];
      return this.errorMessages[priorityError];
    }
    return '';
  }
}
