import { Component, Input } from '@angular/core';
import { BaseComponent } from '../base.component';
import { ValidatorService } from '../../services/validator.service';

@Component({
  selector: 'web-user-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  providers: [ValidatorService],
})
export class DatePickerComponent extends BaseComponent {
  @Input() minDate: Date;
  @Input() maxDate: Date;
}
