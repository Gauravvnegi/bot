import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormComponent } from '../form.components';
import { ControlContainer } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
})
export class CheckboxComponent extends FormComponent implements OnInit {
  @Input() value: boolean = false;
  @Input() isDisabled: boolean = false;
  @Output() change = new EventEmitter<CheckboxEvent>(null);
  inputId: string;

  constructor(public controlContainer: ControlContainer) {
    super(controlContainer);
  }

  ngOnInit(): void {
    if (this.controlName) {
      this.initInputControl();
      this.value = this?.inputControl?.value;

      this.inputControl?.valueChanges?.subscribe((res: boolean) => {
        this.value = res;
      });
    }
  }
  toggleSelectAll(): void {
    this.value = !this.value;
    this.change.emit({ checked: this.value });
    this.controlContainer.control.get(this.controlName).setValue(this.value);
  }
}

export type CheckboxEvent = {
  checked: boolean;
};
