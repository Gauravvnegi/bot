import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { outletRoutes } from '../../../constants/routes';
import { areaUnits, days, hours } from '../../../constants/data';
import { Router } from '@angular/router';
import { Feature } from '../../../types/outlet';
@Component({
  selector: 'hospitality-bot-restaurant-form',
  templateUrl: './restaurant-form.component.html',
  styleUrls: ['./restaurant-form.component.scss'],
})
export class RestaurantFormComponent implements OnInit {
  routes = outletRoutes;
  @Output() onCreateAndContinueFeature = new EventEmitter<Feature>();

  days = days;
  hours = hours;
  areaUnits = areaUnits;

  constructor(
    public controlContainer: ControlContainer,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onCreateAndContinue(features: Feature) {
    this.onCreateAndContinueFeature.emit(features);
  }
}
