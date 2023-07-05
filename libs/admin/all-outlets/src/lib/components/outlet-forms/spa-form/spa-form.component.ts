import { Component, OnInit } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { days, hours } from '../../../constants/data';

@Component({
  selector: 'hospitality-bot-spa-form',
  templateUrl: './spa-form.component.html',
  styleUrls: ['./spa-form.component.scss'],
})
export class SpaFormComponent implements OnInit {
  days = days;
  hours = hours;

  constructor(public controlContainer: ControlContainer) {}

  ngOnInit(): void {}
}
