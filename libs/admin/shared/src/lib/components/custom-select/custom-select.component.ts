import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import * as _ from 'lodash';

@Component({
  selector: 'hospitality-bot-custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CustomSelectComponent,
      multi: true,
    },
  ],
})
export class CustomSelectComponent implements ControlValueAccessor {
  constructor() {}

  options: any[] = [];
  value: any[] = [];
  @Input() requiredProperty: string;
  @Input() optionalProperties: string[];
  @Input() selectedLabel: string[];
  @Input() set itemList(value: Record<string, any>[]) {
    if (!!value) {
      this.options = value.map((item) => {
        let checked = false;
        if (this.value.length) {
          checked =
            this.value.findIndex(
              (res) =>
                res[this.requiredProperty] === item[this.requiredProperty]
            ) > -1;
        }
        return { ...item, checked };
      });
    }
  }

  onChange = (value: any[]) => {};
  onTouched = () => {};

  writeValue(controlValue: any): void {
    if (this.options.length) {
      this.options = this.options.map((item) => {
        let checked =
          controlValue.findIndex(
            (res) => res[this.requiredProperty] === item[this.requiredProperty]
          ) > -1;

        return {
          ...item,
          checked,
        };
      });
    }

    const selectedProps: string[] = this.optionalProperties;
    selectedProps?.unshift(this.requiredProperty);

    if (selectedProps) {
      this.value = _.map(controlValue, (e) => _.pick(e, selectedProps));
    } else {
      this.value = _.map(controlValue, this.requiredProperty);
    }
    this.onChange(this.value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  selectItems(i: number) {
    const selectedProps = this.optionalProperties;
    selectedProps?.unshift(this.requiredProperty);
    const valueItem = this.options[i];
    if (!valueItem.checked) {
      valueItem.checked = true;

      if (selectedProps) {
        this.value.push(_.pick(valueItem, selectedProps));
      } else {
        this.value.push(valueItem[this.requiredProperty]);
      }
    } else {
      valueItem.checked = false;
      let index: number;
      if (selectedProps) {
        index = this.value.findIndex(
          (item) =>
            item[this.requiredProperty] === valueItem[this.requiredProperty]
        );
      } else {
        index = this.value.findIndex(
          (item) => item === valueItem[this.requiredProperty]
        );
      }
      this.value.splice(index, 1);
    }
    this.onChange(this.value);
  }
}
