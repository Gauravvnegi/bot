import { Component, OnInit } from '@angular/core';
import { outletBusinessRoutes } from '../../../constants/routes';

@Component({
  selector: 'hospitality-bot-food-package',
  templateUrl: './food-package.component.html',
  styleUrls: ['./food-package.component.scss'],
})
export class FoodPackageComponent implements OnInit {
  routerLink = outletBusinessRoutes;

  constructor() {}

  ngOnInit(): void {}
}
