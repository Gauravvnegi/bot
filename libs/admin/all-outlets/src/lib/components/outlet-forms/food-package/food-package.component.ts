import { Component, Input, OnInit } from '@angular/core';
import { outletBusinessRoutes } from '../../../constants/routes';
import {
  noRecordActionForFood,
  noRecordActionForFoodWithId,
} from '../../../constants/form';

@Component({
  selector: 'hospitality-bot-food-package',
  templateUrl: './food-package.component.html',
  styleUrls: ['./food-package.component.scss'],
})
export class FoodPackageComponent implements OnInit {
  routerLink = outletBusinessRoutes;
  noRecordActionForFood = noRecordActionForFood;

  @Input() set isId(isId: boolean) {
    if (isId) {
      this.noRecordActionForFood = noRecordActionForFoodWithId;
    }
  }

  constructor() {}

  ngOnInit(): void {}
}
