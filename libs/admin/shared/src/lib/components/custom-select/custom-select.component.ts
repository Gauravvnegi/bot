import { Component, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
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
export class CustomSelectComponent implements OnInit, ControlValueAccessor {
  constructor() {}

  options: any[] = [];
  @Input() selectProperties: string;
  @Input() extraProperties: string[];

  @Input() paid: string;
  @Input() set itemList(value: Record<string, any>[]) {
    this.options = value.map((item) => {
      let checked = false;
      if (this.value.length) {
        checked =
          this.value.findIndex(
            (res) => res[this.selectProperties] === item[this.selectProperties]
          ) > -1;
      }
      return { ...item, checked };
    });
  }

  value: any[] = [];
  ngOnInit(): void {}

  onChange = (value: any[]) => {};
  onTouched = () => {};

  writeValue(controlValue: any): void {
    if (this.options.length) {
      this.options = this.options.map((item) => {
        let checked =
          controlValue.findIndex(
            (res) => res[this.selectProperties] === item[this.selectProperties]
          ) > -1;

        return {
          ...item,
          checked,
        };
      });
    }

    const allProps: string[] = this.extraProperties;
    allProps?.unshift(this.selectProperties);

    if (allProps) {
      this.value = _.map(controlValue, (e) => _.pick(e, allProps));
    } else {
      this.value = _.map(controlValue, this.selectProperties);
    }
    this.onChange(this.value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  getItems(event: MatCheckboxChange, i: number) {
    const allProps = this.extraProperties;
    allProps?.unshift(this.selectProperties);
    const valueItem = this.options[i];
    if (event.checked == true) {
      valueItem.checked = true;

      if (allProps) {
        this.value.push(_.pick(valueItem, allProps));
      } else {
        this.value.push(valueItem[this.selectProperties]);
      }
    } else {
      valueItem.checked = false;

      let index: number;
      if (allProps) {
        index = this.value.findIndex(
          (item) =>
            item[this.selectProperties] === valueItem[this.selectProperties]
        );
      } else {
        index = this.value.findIndex(
          (item) => item === valueItem[this.selectProperties]
        );
      }
      this.value.splice(index, 1);
    }
    this.onChange(this.value);
  }
}
