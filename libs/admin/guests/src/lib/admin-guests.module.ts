import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { AdminGuestsRoutingModule } from './admin-guests.routing.module';

export const adminGuestsRoutes: Route[] = [];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AdminGuestsRoutingModule
  ],
  declarations: [...AdminGuestsRoutingModule.components]
})
export class AdminGuestsModule {}
