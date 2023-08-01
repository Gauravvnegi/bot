import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { FormProps, Option } from '../../../types/form.type';
import { FormComponent } from '../form.components';
@Component({
  selector: 'hospitality-bot-multiple-prefix-input',
  templateUrl: './multiple-prefix-input.component.html',
  styleUrls: ['./multiple-prefix-input.component.scss'],
})
export class MultiplePrefixInputComponent extends FormComponent
  implements OnInit {
  constructor(public controlContainer: ControlContainer) {
    super(controlContainer);
  }

  currencyControlName: string = '';
  preCountControlName: string = '';
  postCountControlName: string = '';

  mainLabel: string = '';
  preCountLabel: string = '';
  postCountLabel: string = '';

  @Input() set controls(value: ControlNames) {
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        this[key] = value[key];
      }
    }
  }

  @Input() set labels(value: Labels) {
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        this[key] = value[key];
      }
    }
  }

  @Input() defaultProps: PrePostType<FormProps>;
  @Input() inputDisabled: PrePostType<boolean> = { pre: false, post: false };

  @Input() currencyOptions: Option[] = [];

  ngOnInit(): void {}

  getProps(type: keyof PrePostType<FormProps>): FormProps {
    const newProps = this.defaultProps ? this.defaultProps[type] : {};
    return {
      ...this.props,
      ...newProps,
    };
  }
}

type PrePostType<T> = { pre?: T; post?: T };

type ControlNames = {
  currencyControlName: string;
  preCountControlName: string;
  postCountControlName: string;
};

type Labels = {
  mainLabel: string;
  preCountLabel: string;
  postCountLabel: string;
};
