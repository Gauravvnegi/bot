import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BulkUpdateFormComponent } from './components/bulk-update-form/bulk-update-form.component';
import { InventoryBulkUpdateComponent } from './components/inventory-bulk-update/inventory-bulk-update.component';
import { InventoryNestedCheckboxTreeComponent } from './components/inventory-nested-checkbox-tree/inventory-nested-checkbox-tree.component';
import { MainComponent } from './components/main/main.component';
import { RoomTypesComponent } from './components/room-types/room-types.component';
import { UpdateInventoryComponent } from './components/update-inventory/update-inventory.component';
import { UpdateReservationComponent } from './components/update-reservation/update-reservation.component';

const appRoutes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        component: UpdateInventoryComponent,
      },
      {
        path: 'inventory-bulk-update',
        component: InventoryBulkUpdateComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminManageInventoryRoutingModule {
  static components = [
    UpdateReservationComponent,
    UpdateInventoryComponent,
    BulkUpdateFormComponent,
    MainComponent,
    InventoryBulkUpdateComponent,
    InventoryNestedCheckboxTreeComponent,
    RoomTypesComponent,
  ];
}
