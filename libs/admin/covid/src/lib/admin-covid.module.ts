import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { AdminCovidRoutingModule } from './admin-covid.routing.module';

@NgModule({
  imports: [
    CommonModule, 
    RouterModule,
    AdminSharedModule,
    AdminCovidRoutingModule
  ],
})
export class AdminCovidModule {}
