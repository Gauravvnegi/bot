import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AllOutletsDataTableComponent } from './components/all-outlets-data-table/all-outlets-data-table.component';
import { MainComponent } from './components/main/main.component';
import { CreateMenuComponent } from './components/create-menu/create-menu.component';
import { MenuDataTableComponent } from './components/menu-data-table/menu-data-table.component';
import { AddMenuItemComponent } from './components/add-menu-item/add-menu-item.component';
import { outletRoutes } from './constants/route';
import { MenuListDataTableComponent } from './components/menu-list-data-table/menu-list-data-table.component';

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
        path: outletRoutes.addMenu.route,
        component: CreateMenuComponent,
      },
      {
        path: `${outletRoutes.addMenu.route}/${outletRoutes.addMenuItem.route}`,
        component: AddMenuItemComponent,
      },
      {
        path: `${outletRoutes.menuList.route}`,
        component: MenuListDataTableComponent
      }
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
  ];
}
