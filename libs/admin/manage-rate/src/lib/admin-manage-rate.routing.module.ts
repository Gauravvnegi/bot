import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BulkUpdateFormComponent } from './components/bulk-update-form/bulk-update-form.component';
import { InventoryBulkUpdateComponent } from './components/inventory-bulk-update/inventory-bulk-update.component';
import { InventoryNestedCheckboxTreeComponent } from './components/inventory-nested-checkbox-tree/inventory-nested-checkbox-tree.component';
import { MainComponent } from './components/main/main.component';
import { RatesBulkUpdateComponent } from './components/rates-bulk-update/rates-bulk-update.component';
import { NestedPanelComponent } from './components/rates-nested-checkbox-tree/nested-panel/nested-panel.component';
import { RatesNestedCheckboxTreeComponent } from './components/rates-nested-checkbox-tree/rates-nested-checkbox-tree.component';
import { RoomTypesComponent } from './components/room-types/room-types.component';
import { UpdateInventoryComponent } from './components/update-inventory/update-inventory.component';
import { UpdateRatesComponent } from './components/update-rates/update-rates.component';
import { UpdateReservationComponent } from './components/update-reservation/update-reservation.component';

const appRoutes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        component: UpdateRatesComponent,
      },
      {
        path: 'rates-bulk-update',
        component: RatesBulkUpdateComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminManageRateRoutingModule {
  static components = [
    UpdateReservationComponent,
    UpdateRatesComponent,
    UpdateInventoryComponent,
    BulkUpdateFormComponent,
    MainComponent,
    RatesNestedCheckboxTreeComponent,
    NestedPanelComponent,
    RatesBulkUpdateComponent,
    InventoryBulkUpdateComponent,
    InventoryNestedCheckboxTreeComponent,
    RoomTypesComponent,
  ];
}
