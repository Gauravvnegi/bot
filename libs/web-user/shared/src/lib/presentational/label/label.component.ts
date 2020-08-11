import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { ValidatorService } from '../../services/validator.service';

@Component({
  selector: 'web-user-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss'],
  providers: [ValidatorService],
})
export class LabelComponent extends BaseComponent {}
