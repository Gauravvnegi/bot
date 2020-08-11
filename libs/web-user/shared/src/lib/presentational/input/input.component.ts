import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { ValidatorService } from '../../services/validator.service';

@Component({
  selector: 'web-user-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [ValidatorService],
})
export class InputComponent extends BaseComponent {}
