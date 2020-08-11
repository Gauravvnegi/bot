import { Component } from '@angular/core';
import { BaseComponent } from '../base.component';
import { ValidatorService } from '../../services/validator.service';

@Component({
  selector: 'web-user-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [ValidatorService],
})
export class CheckboxComponent extends BaseComponent {

  changeEvent(event){
  }
}
