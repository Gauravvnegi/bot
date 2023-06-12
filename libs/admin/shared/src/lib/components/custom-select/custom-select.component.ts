import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Optional,
  Output,
  Self,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NgControl,
} from '@angular/forms';
import { EmptyViewType } from '../../types/table.type';

@Component({
  selector: 'hospitality-bot-custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.scss'],
})
export class CustomSelectComponent implements OnInit, ControlValueAccessor {
  options: Record<string, any>[] = [];
  value: string[] = [];
  @Input() loading: boolean;
  @Input() noRecordsAction: EmptyViewType;

  @Input() label: string;
  @Input() description: string;
  @Input() validationErrMsg: string = 'This is required field.';

  @Input() optionValue: string = 'id';
  @Input() optionLabel: string = 'name';

  @Input() fullView: boolean = false;
  @Input() noMoreData: boolean = false;

  @Output() loadMoreData = new EventEmitter();
  @Output() viewAll = new EventEmitter();
  @Output() addAction = new EventEmitter();

  @Input() addActLabel: string;

  @Input() set itemList(options: Record<string, any>[]) {
    this.options =
      options?.map((item) => {
        let checked = false;

        checked = this.value?.includes(item[this.optionValue]);
        return { ...item, checked };
      }) ?? [];
  }

  @Input() emptyMessage = 'No Data Available';

  constructor(@Self() @Optional() public control: NgControl) {
    if (this.control) this.control.valueAccessor = this;
  }

  ngOnInit(): void {
    this.addRequiredAsterisk();
  }

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

  addRequiredAsterisk() {
    const validators = this.control.control?.validator;
    const isRequired =
      validators && validators({} as AbstractControl)?.required;
    if (this.label && isRequired) {
      this.label = this.label + ' *';
    }
  }

  loadMore() {
    this.loadMoreData.emit();
  }
}
