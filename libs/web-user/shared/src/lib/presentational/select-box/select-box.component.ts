import { Component, OnInit, Output } from '@angular/core';
import { BaseComponent } from '../base.component';
import { ValidatorService } from '../../services/validator.service';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'web-user-select-box',
  templateUrl: './select-box.component.html',
  styleUrls: ['./select-box.component.scss'],
  providers: [ValidatorService],
})
export class SelectBoxComponent extends BaseComponent {

  @Output() 
  optionChange= new EventEmitter();
  
  change(event)
  {
    const selectData = {
      "index" : this.index,
      "selectEvent" : event,
      'formControlName': this.name,
      'formGroup':this.parentForm,
    }
    this.optionChange.emit(selectData);
  }
}
