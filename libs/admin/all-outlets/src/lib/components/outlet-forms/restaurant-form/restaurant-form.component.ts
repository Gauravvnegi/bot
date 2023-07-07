import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { areaUnits, days, hours } from '../../../constants/data';
import {
  noRecordActionForComp,
  noRecordActionForCompWithId,
  noRecordActionForMenu,
  noRecordActionForMenuWithId,
} from '../../../constants/form';
import { navRoutes } from '../../../constants/routes';
import { Feature } from '../../../types/outlet';
@Component({
  selector: 'hospitality-bot-restaurant-form',
  templateUrl: './restaurant-form.component.html',
  styleUrls: ['./restaurant-form.component.scss'],
})
export class RestaurantFormComponent implements OnInit {
  routes = navRoutes;
  @Input() set outletId(id: string) {
    if (id) {
      this.modifyNoRecordActions();
    }
  }
  @Output() onCreateAndContinueFeature = new EventEmitter<Feature>();
  noRecordActionForComp = noRecordActionForComp;
  noRecordActionForMenu = noRecordActionForMenu;

  days = days;
  hours = hours;
  areaUnits = areaUnits;

  constructor(public controlContainer: ControlContainer) {}

  ngOnInit(): void {}

  modifyNoRecordActions() {
    this.noRecordActionForComp = noRecordActionForCompWithId;
    this.noRecordActionForMenu = noRecordActionForMenuWithId;
  }

  onCreateAndContinue(features: Feature) {
    this.onCreateAndContinueFeature.emit(features);
  }
}
