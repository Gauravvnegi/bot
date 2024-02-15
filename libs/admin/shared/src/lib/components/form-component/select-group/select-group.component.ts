import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { Option } from '../../../types/form.type';
import { FormComponent } from '../form.components';

@Component({
  selector: 'hospitality-bot-select-group',
  templateUrl: './select-group.component.html',
  styleUrls: ['./select-group.component.scss'],
})
export class SelectGroupComponent extends FormComponent implements OnInit {
  defaultOptions: (Option & { isSelected: boolean; isDisabled?: boolean })[];

  @Input() fieldType: FieldType = 'radio';
  @Input() isAllOption: boolean = false;

  @Input() set options(input: Option[]) {
    const selectedValue = [];
    this.menuOptions = input;

    this.defaultOptions = input?.map((item) => {
      if (item?.isSelected) selectedValue.push(item.value);
      return {
        ...item,
        isSelected: item.isSelected ?? false,
      };
    });

    if (this.fieldType === 'checkbox') {
      this.initInputControl();
      this.inputControl.patchValue(selectedValue, { emitEvent: false });
    }
  }

  constructor(public controlContainer: ControlContainer) {
    super(controlContainer);
  }

  ngOnInit(): void {
    this.initInputControl();
    //if input control has initial value
    if (this?.inputControl?.value) {
      this.defaultOptions = this.menuOptions.map((item) => ({
        ...item,
        isSelected: this?.inputControl?.value?.includes(item.value),
      }));
      this.isAllOption && this.handelOptionSelection(); //it is not required but to handel old data
    }

    this.inputControl.valueChanges.subscribe((res) => {
      this.defaultOptions = this.menuOptions.map((item) => ({
        ...item,
        isSelected: res?.includes(item.value),
      }));
      this.isAllOption && this.handelOptionSelection(); //it is not required but to handel old data
    });
  }

  handleAllSelection() {
    const allOption = this.defaultOptions.find((item) => item.value === 'ALL');
    if (allOption) {
      allOption.isSelected = !this.defaultOptions
        .filter((item) => item.value !== 'ALL')
        .some((item) => !item.isSelected);
    }
  }

  handelOptionSelection() {
    this.defaultOptions &&
      this.defaultOptions.find((item) => item.value === 'ALL')?.isSelected &&
      this.defaultOptions.forEach((item) => {
        item.isSelected = true;
      });
  }

  handleClick(value: string, idx: number) {
    if (this.fieldType === 'checkbox') {
      this.defaultOptions[idx].isSelected = !this.defaultOptions[idx]
        .isSelected;

      //to handle the case when all option is toggle, then we need mark all option selected
      this.isAllOption &&
        value === 'ALL' &&
        this.defaultOptions
          .filter((item) => !item?.isDisabled)
          .map(
            (item) => (item.isSelected = this.defaultOptions[idx].isSelected)
          );

      this.isAllOption && this.handleAllSelection();

      this.inputControl.setValue(
        this.defaultOptions
          .filter((item) => item.isSelected)
          .map((item) => item.value),
        { emitEvent: false }
      );
    }

    if (this.fieldType === 'radio') {
      this.defaultOptions.forEach((item, index) => {
        item.isSelected = index === idx;
      });
      this.inputControl.setValue(value, { emitEvent: false });
    }
  }
}

type FieldType = 'checkbox' | 'radio';
