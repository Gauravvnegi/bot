import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { outletRoutes } from '../../../constants/routes';
import { areaUnits, days, hours } from '../../../constants/data';
@Component({
  selector: 'hospitality-bot-restaurant-form',
  templateUrl: './restaurant-form.component.html',
  styleUrls: ['./restaurant-form.component.scss'],
})
export class RestaurantFormComponent implements OnInit {
  routes = outletRoutes;

  days = days;
  hours = hours;
  areaUnits = areaUnits;

  constructor(public controlContainer: ControlContainer) {}

  ngOnInit(): void {}
}
