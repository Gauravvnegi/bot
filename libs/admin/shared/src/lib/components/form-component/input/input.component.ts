import { Component, Input } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { map } from 'lodash';
import { FormComponent } from '../form.components';
@Component({
  selector: 'hospitality-bot-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent extends FormComponent {
  constructor(public controlContainer: ControlContainer) {
    super(controlContainer);
  }

  ngOnInit(): void {}
}
