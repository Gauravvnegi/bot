import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
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

  @Input() itemsList: any[];
  // {value:'value',label:'show'//'name'}
  @Input() selectProperties: any;
  @Input() itemType: string;
  // labels? 'label' | 'paid'
  // label? (label)
  // @Input() selectedLabels: string | string[] = ['label'];

  value: any[] = [];
  selectedItems: any[] = [];
  modifiedValue: any[];
  isChecked: boolean;

  ngOnInit(): void {}

  onChange: (value: any[]) => void;
  onTouched: (value: any[]) => void;

  writeValue(controlValue: any): void {
    this.value = controlValue;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  getItems(event: MatCheckboxChange, i: number) {
    if (event.checked == true) {
      this.selectedItems.push(this.itemsList[i]);
    } else {
      let index = this.selectedItems.findIndex((x) => x == this.itemsList[i]);
      this.selectedItems.splice(index, 1);
    }
    if (Array.isArray(this.selectProperties)) {
      this.modifiedValue = _.map(this.selectedItems, (e) =>
        _.pick(e, this.selectProperties)
      );
      this.onChange(this.modifiedValue);
    } else if (typeof this.selectProperties == 'string') {
      this.modifiedValue = _.map(this.selectedItems, this.selectProperties);
      this.onChange(this.modifiedValue);
    } else {
      this.onChange(this.selectedItems);
    }
  }
}
