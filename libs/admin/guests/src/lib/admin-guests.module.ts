import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { AdminGuestsRoutingModule } from './admin-guests.routing.module';
import { ChartsModule } from 'ng2-charts';

export const adminGuestsRoutes: Route[] = [];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AdminGuestsRoutingModule,
    ChartsModule,
  ],
  declarations: [...AdminGuestsRoutingModule.components]
})
export class AdminGuestsModule {}
