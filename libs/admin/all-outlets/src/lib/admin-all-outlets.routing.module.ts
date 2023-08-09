import { Component, NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AddMenuItemComponent } from './components/add-menu-item/add-menu-item.component';
import { AddOutletComponent } from './components/add-outlet/add-outlet.component';
import { AllOutletsDataTableComponent } from './components/all-outlets-data-table/all-outlets-data-table.component';
import { CreateMenuComponent } from './components/create-menu/create-menu.component';
import { MainComponent } from './components/main/main.component';
import { MenuDataTableComponent } from './components/menu-data-table/menu-data-table.component';
import { RestaurantFormComponent } from './components/outlet-forms/restaurant-form/restaurant-form.component';
import { RulesComponent } from './components/outlet-forms/rules/rules.component';
import { SpaFormComponent } from './components/outlet-forms/spa-form/spa-form.component';
import { BanquetFormComponent } from './components/outlet-forms/banquet-form/banquet-form.component';
import { CreateFoodPackageComponent } from './components/create-food-package/create-food-package.component';
import { FoodItemsComponent } from './components/food-items/food-items.component';
import { FoodPackageComponent } from './components/outlet-forms/food-package/food-package.component';
import { ImportServiceComponent } from './components/import-service/import-service.component';
import { outletBusinessRoutes } from './constants/routes';
import { ViewAllComponent } from './components/Services/view-all.component';
import { ChildMainComponent } from './components/child-main/child-main.component';

const appRoutes: Route[] = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        component: AddOutletComponent,
      },
      {
        path: outletBusinessRoutes.editOutlet.route,
        component: MainComponent,
        children: [
          {
            path: '',
            component: AddOutletComponent,
          },
          {
            path: outletBusinessRoutes.importService.route,
            component: ImportServiceComponent,
            pathMatch: 'full',
          },
          {
            path: outletBusinessRoutes.services.route,
            component: ViewAllComponent,
            pathMatch: 'full',
          },
          {
            path: outletBusinessRoutes.foodPackage.route,
            component: ChildMainComponent,
            pathMatch: 'full',

            children: [
              {
                path: '',
                component: CreateFoodPackageComponent,
              },
              {
                path: outletBusinessRoutes.editFoodPackage.route,
                component: CreateFoodPackageComponent,
              },
            ],
          },
          {
            path: outletBusinessRoutes.menu.route,
            component: ChildMainComponent,
            children: [
              {
                path: '',
                component: CreateMenuComponent,
              },
              {
                path: outletBusinessRoutes.editMenu.route,
                component: ChildMainComponent,
                children: [
                  {
                    path: '',
                    component: CreateMenuComponent,
                  },
                  {
                    path: outletBusinessRoutes.menuItem.route,
                    component: ChildMainComponent,
                    children: [
                      {
                        path: '',
                        component: AddMenuItemComponent,
                      },
                      {
                        path: outletBusinessRoutes.editMenuItem.route,
                        component: AddMenuItemComponent,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
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
    AddOutletComponent,
    RulesComponent,
    RestaurantFormComponent,
    SpaFormComponent,
    BanquetFormComponent,
    CreateFoodPackageComponent,
    FoodItemsComponent,
    FoodPackageComponent,
    ImportServiceComponent,
    ViewAllComponent,
    ChildMainComponent,
  ];
}
