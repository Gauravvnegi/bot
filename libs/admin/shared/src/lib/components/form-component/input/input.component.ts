import { Component, Input } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { FormComponent } from '../form.components';

@Component({
  selector: 'hospitality-bot-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent extends FormComponent {
  @Input() maxLength: number;
  @Input() min: number;
  @Input() max: number;

  constructor(public controlContainer: ControlContainer) {
    super(controlContainer);
  }

  ngOnInit(): void {}
}
