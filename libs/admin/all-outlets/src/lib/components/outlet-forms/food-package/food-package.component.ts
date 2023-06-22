import { Component, OnInit } from '@angular/core';
import { outletRoutes } from '../../../constants/routes';

@Component({
  selector: 'hospitality-bot-food-package',
  templateUrl: './food-package.component.html',
  styleUrls: ['./food-package.component.scss'],
})
export class FoodPackageComponent implements OnInit {
  routes = outletRoutes;

  constructor() {}

  ngOnInit(): void {}
}
