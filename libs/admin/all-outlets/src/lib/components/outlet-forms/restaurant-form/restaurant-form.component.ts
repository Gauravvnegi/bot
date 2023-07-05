import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer, FormBuilder } from '@angular/forms';
import { navRoutes, outletBusinessRoutes } from '../../../constants/routes';
import { areaUnits, days, hours } from '../../../constants/data';
import { ActivatedRoute, Router } from '@angular/router';
import { Feature } from '../../../types/outlet';
import { AddOutletComponent } from '../../add-outlet/add-outlet.component';
import { OutletService } from '../../../services/outlet.service';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { HotelDetailService } from '@hospitality-bot/admin/shared';
@Component({
  selector: 'hospitality-bot-restaurant-form',
  templateUrl: './restaurant-form.component.html',
  styleUrls: ['./restaurant-form.component.scss'],
})
export class RestaurantFormComponent implements OnInit {
  routes = navRoutes;
  @Output() onCreateAndContinueFeature = new EventEmitter<Feature>();

  days = days;
  hours = hours;
  areaUnits = areaUnits;

  constructor(public controlContainer: ControlContainer) {}

  ngOnInit(): void {}

  onCreateAndContinue(features: Feature) {
    this.onCreateAndContinueFeature.emit(features);
  }
}
