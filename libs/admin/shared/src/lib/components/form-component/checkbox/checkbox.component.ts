import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormComponent } from '../form.components';
import { ControlContainer } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
})
export class CheckboxComponent extends FormComponent implements OnInit {
  inputId: string;
  @Output() change = new EventEmitter<CheckboxEvent>();

  constructor(public controlContainer: ControlContainer) {
    super(controlContainer);
  }

  ngOnInit(): void {
    this.initInputControl();
    this.listenChanges();
  }

  listenChanges() {
    this.control.valueChanges.subscribe((res) => {
      this.change.emit({ checked: res });
    });
  }

  get control() {
    return this.controlContainer.control.get(this.controlName);
  }
}

export type CheckboxEvent = {
  checked: boolean;
};
