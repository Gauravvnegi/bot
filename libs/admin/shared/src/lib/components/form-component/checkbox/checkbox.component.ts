import { Component, OnInit } from '@angular/core';
import { FormComponent } from '../form.components';
import { ControlContainer } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
})
export class CheckboxComponent extends FormComponent implements OnInit {
  value: boolean = false;
  inputId: string;

  constructor(public controlContainer: ControlContainer) {
    super(controlContainer);
  }

  ngOnInit(): void {
    this.initInputControl();
    this.value = this.inputControl.value;
  }
  toggleSelectAll(): void {
    this.value = !this.value;
    this.controlContainer.control.get(this.controlName).setValue(this.value);
  }
}
