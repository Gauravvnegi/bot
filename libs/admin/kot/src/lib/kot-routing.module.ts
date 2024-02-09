import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { KotTableComponent } from './components/kot-table/kot-table.component';
import { KotComponent } from './components/kot/kot.component';
import { KotCardComponent } from './components/kot-card/kot-card.component';
import { PendingItemSummaryComponent } from './components/pending-item-summary/pending-item-summary.component';

const routes: Routes = [
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
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KotRoutingModule {
  static components = [
    MainComponent,
    KotTableComponent,
    KotComponent,
    KotCardComponent,
    PendingItemSummaryComponent,
  ];
}
