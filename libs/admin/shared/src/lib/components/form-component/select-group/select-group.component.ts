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
  defaultOptions: (Option & { isSelected: boolean })[];

  @Input() fieldType: FieldType = 'radio';

  @Input() set options(input: Option[]) {
    this.menuOptions = input;
    this.defaultOptions = input?.map((item) => ({
      ...item,
      isSelected: false,
    }));
  }

  constructor(public controlContainer: ControlContainer) {
    super(controlContainer);
  }

  ngOnInit(): void {
    this.initInputControl();

    this.inputControl.valueChanges.subscribe((res) => {
      this.defaultOptions = this.menuOptions.map((item) => ({
        ...item,
        isSelected: !!res.includes(item.value),
      }));
    });
  }

  handleClick(value: string, idx: number) {
    if (this.fieldType === 'checkbox') {
      this.defaultOptions[idx].isSelected = !this.defaultOptions[idx]
        .isSelected;
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
