import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
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
  options: Record<string, any>[] = [];
  value: string[] = [];

  @Input() label: string;
  @Input() description: string;

  @Input() optionValue: string = 'id';
  @Input() optionLabel: string = 'name';

  @Input() fullView: boolean = false;
  @Input() noMoreData: boolean = false;

  @Output() loadMoreData = new EventEmitter();
  @Output() viewAll = new EventEmitter();

  @Input() set itemList(options: Record<string, any>[]) {
    this.options =
      options?.map((item) => {
        let checked = false;

        checked = this.value?.includes(item[this.optionValue]);
        return { ...item, checked };
      }) ?? [];
  }

  @Input() emptyMessage = 'No Data Available';
  @Input() noRecordsAction: { name: string; link: string };

  constructor() {}

  onChange = (value: any[]) => {};
  onTouched = () => {};

  writeValue(controlValue: any): void {
    if (this.options.length && controlValue) {
      this.options = this.options.map((item) => {
        let checked = controlValue?.includes(item[this.optionValue]);
        return { ...item, checked };
      });
    }

    this.value = controlValue;
    this.onChange(this.value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  selectItems(i: number) {
    const valueItem = this.options[i];
    if (!valueItem.checked) {
      this.value.push(valueItem[this.optionValue]);
    } else {
      let index = this.value.findIndex(
        (item) => item === valueItem[this.optionValue]
      );
      this.value.splice(index, 1);
    }
    valueItem.checked = !valueItem.checked;
    this.onChange(this.value);
  }

  loadMore() {
    this.loadMoreData.emit();
  }
}
