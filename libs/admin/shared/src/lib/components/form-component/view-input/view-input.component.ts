import { Component, Input, OnInit } from '@angular/core';
import { FormComponent } from '../form.components';
import { ControlContainer } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-view-input',
  templateUrl: './view-input.component.html',
  styleUrls: ['./view-input.component.scss'],
})
export class ViewInputComponent extends FormComponent {
  value: number | string;
  @Input() suffix: string;
  @Input() strikeValue: number | string;

  constructor(public controlContainer: ControlContainer) {
    super(controlContainer);
  }

  ngOnInit(): void {
    this.initInputControl();
    this.value = this.inputControl.value;
    this.inputControl.valueChanges.subscribe((val) => {
      this.value = val;
    });
  }
}
