import { Component, Input, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { ValidatorService } from '../../services/validator.service';

@Component({
  selector: 'web-user-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss'],
  providers: [ValidatorService],
})
export class TimePickerComponent extends BaseComponent {
  // @ViewChild('timePickerRef') timePicker;
  @Input() defaultTime = '11:00 am';
  @Input() format = 24;

  // ngAfterViewInit(){
  //   this.timePicker.timepickerTime = this.defaultTime;
  // }
}
