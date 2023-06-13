import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AddMenuItemComponent } from './components/add-menu-item/add-menu-item.component';
import { AddOutletComponent } from './components/add-outlet/add-outlet.component';
import { AllOutletsDataTableComponent } from './components/all-outlets-data-table/all-outlets-data-table.component';
import { CreateMenuComponent } from './components/create-menu/create-menu.component';
import { MainComponent } from './components/main/main.component';
import { MenuDataTableComponent } from './components/menu-data-table/menu-data-table.component';
import { MenuListDataTableComponent } from './components/menu-list-data-table/menu-list-data-table.component';
import { RestaurantFormComponent } from './components/outlet-forms/restaurant-form/restaurant-form.component';
import { RulesComponent } from './components/outlet-forms/rules/rules.component';
import { outletRoutes } from './constants/routes';
import { SpaFormComponent } from './components/outlet-forms/spa-form/spa-form.component';
import { BanquetFormComponent } from './components/outlet-forms/banquet-form/banquet-form.component';
import { CreateFoodPackageComponent } from './components/create-food-package/create-food-package.component';
import { FoodItemsComponent } from './components/food-items/food-items.component';

const appRoutes: Route[] = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        component: AllOutletsDataTableComponent,
      },
      {
        path: outletRoutes.addOutlet.route,
        component: MainComponent,
        children: [
          {
            path: '',
            component: AddOutletComponent,
          },
          {
            path: outletRoutes.addMenu.route,
            component: CreateMenuComponent,
          },
          {
            path: `${outletRoutes.addMenu.route}/${outletRoutes.addMenuItem.route}`,
            component: AddMenuItemComponent,
          },
        ],
      },
      {
        path: `${outletRoutes.menuList.route}`,
        component: MenuListDataTableComponent,
      },
      {
        path: `${outletRoutes.createFoodPackage.route}`,
        component: CreateFoodPackageComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminAllOutletsRoutingModule {
  static components = [
    MainComponent,
    AllOutletsDataTableComponent,
    CreateMenuComponent,
    MenuDataTableComponent,
    AddMenuItemComponent,
    MenuListDataTableComponent,
    AddOutletComponent,
    RulesComponent,
    RestaurantFormComponent,
    SpaFormComponent,
    BanquetFormComponent,
    CreateFoodPackageComponent,
    FoodItemsComponent,
  ];
}
