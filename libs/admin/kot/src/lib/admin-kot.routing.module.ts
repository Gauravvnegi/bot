import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { KotComponent } from './components/kot/kot.component';
import { KotDataTableComponent } from './components/kot-data-table/kot-data-table.component';
import { KotService } from './services/kot.service';

const appRoutes: Route[] = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        component: KotComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
  providers: [KotService],
})
export class AdminKotRoutingModule {
  static components = [MainComponent, KotComponent, KotDataTableComponent];
}
