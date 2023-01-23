import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-custom-size-input',
  templateUrl: './custom-size-input.component.html',
  styleUrls: ['./custom-size-input.component.scss'],
})
export class CustomSizeInputComponent {
  @Input() parentForm: FormGroup;
  @Input() name: string;
  @Input() customSize: number;
}
