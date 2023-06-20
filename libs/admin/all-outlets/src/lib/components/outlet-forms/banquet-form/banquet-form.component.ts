import { Component, OnInit } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { areaUnits, days, hours } from '../../../constants/data';

@Component({
  selector: 'hospitality-bot-banquet-form',
  templateUrl: './banquet-form.component.html',
  styleUrls: ['./banquet-form.component.scss'],
})
export class BanquetFormComponent implements OnInit {
  hours = hours;
  days = days;
  areaUnits = areaUnits;
  constructor(public controlContainer: ControlContainer) {}

  ngOnInit(): void {}
}
