import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { FormProps, Option } from '../../../types/form.type';
import { FormComponent } from '../form.components';

@Component({
  selector: 'hospitality-bot-prefix-field',
  templateUrl: './prefix-field.component.html',
  styleUrls: ['./prefix-field.component.scss'],
})
export class PrefixFieldComponent extends FormComponent {
  constructor(public controlContainer: ControlContainer) {
    super(controlContainer);
  }

  @Input() preFieldType: InputFieldTypes = 'select';
  @Input() postFieldType: InputFieldTypes = 'input';

  @Input() preControlName: string;
  @Input() postControlName: string;

  @Input() preOptions: Option[];
  @Input() postOptions: Option[];

  @Input() defaultProps: PrePostType<FormProps>;
  @Input() inputDisabled: PrePostType<boolean> = { pre: false, post: false };

  /**
   * Handle options setting if only of them is select type
   */
  @Input() set options(input: Option[]) {
    if (input && this.preFieldType === 'select') {
      this.preOptions = input;
    } else if (input && this.postFieldType === 'select') {
      this.postOptions = input;
    }
  }

  ngOnInit(): void {}

  getProps(type: keyof PrePostType<FormProps>): FormProps {
    const newProps = this.defaultProps ? this.defaultProps[type] : {};
    return {
      ...this.props,
      ...newProps,
    };
  }
}

type InputFieldTypes = 'input' | 'select';

type PrePostType<T> = { pre?: T; post?: T };
