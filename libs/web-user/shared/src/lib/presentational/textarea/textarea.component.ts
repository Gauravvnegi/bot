import { Component } from '@angular/core';
import { BaseComponent } from '../base.component';
import { ValidatorService } from '../../services/validator.service';
@Component({
  selector: 'web-user-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  providers: [ValidatorService],
})
export class TextareaComponent extends BaseComponent {}
