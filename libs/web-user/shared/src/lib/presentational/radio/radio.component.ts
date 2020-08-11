import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { ValidatorService } from '../../services/validator.service';
@Component({
  selector: 'web-user-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
  providers: [ValidatorService],
})
export class RadioComponent extends BaseComponent {}
