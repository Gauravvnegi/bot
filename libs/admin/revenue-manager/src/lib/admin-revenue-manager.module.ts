import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminRevenueMangerRoutingModule } from './admin-revenue-manager.routing.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AdminRevenueMangerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [...AdminRevenueMangerRoutingModule.components],
  providers: [],
})
export class AdminRevenueManagerModule {}
