import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  noRecordActionForFood,
  noRecordActionForFoodWithId,
} from '../../../constants/form';
import { outletBusinessRoutes } from '../../../constants/routes';
import { Feature } from '../../../types/outlet';

@Component({
  selector: 'hospitality-bot-food-package',
  templateUrl: './food-package.component.html',
  styleUrls: ['./food-package.component.scss'],
})
export class FoodPackageComponent implements OnInit {
  routerLink = outletBusinessRoutes;
  noRecordActionForFood = noRecordActionForFood;
  @Output() onCreateAndContinueFeature = new EventEmitter<Feature>();

  @Input() set isOutletId(isId: boolean) {
    if (isId) {
      this.noRecordActionForFood = noRecordActionForFoodWithId;
    }
  }

  ngOnInit(): void {}

  onCreateAndContinue(feature: Feature): void {
    this.onCreateAndContinueFeature.emit(feature);
  }
}
