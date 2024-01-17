import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { TableManagementDatableComponent } from './components/table-management-datable/table-management-datable.component';
import { TableManagementComponent } from './components/table-management/table-management.component';
import { EditTableComponent } from './components/edit-table/edit-table.component';
import { tableManagementRoutes } from './constants/routes';
import { EditAreaComponent } from './components/edit-area/edit-area.component';

const appRoutes: Route[] = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        component: TableManagementComponent,
      },
      {
        path: tableManagementRoutes.createTable.route,
        component: EditTableComponent,
      },
      {
        path: tableManagementRoutes.editable.route,
        component: EditTableComponent,
      },
      {
        path: tableManagementRoutes.createArea.route,
        component: EditAreaComponent,
      },
      {
        path: tableManagementRoutes.editArea.route,
        component: EditAreaComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminTableManagementRoutingModule {
  static components = [
    MainComponent,
    TableManagementDatableComponent,
    TableManagementComponent,
    EditTableComponent,
    EditAreaComponent,
  ];
}
