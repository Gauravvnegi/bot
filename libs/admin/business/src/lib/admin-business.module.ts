import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { AdminBusinessRoutingModule } from './admin-business.routing.module';

@NgModule({
  imports: [
    CommonModule,
    AdminBusinessRoutingModule,
    RouterModule,
    AdminSharedModule,
  ],
  declarations: [...AdminBusinessRoutingModule.components],
})
export class AdminBusinessModule {}
