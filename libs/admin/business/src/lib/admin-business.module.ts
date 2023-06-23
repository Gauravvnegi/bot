import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { AdminBusinessRoutingModule } from './admin-business.routing.module';
import { BusinessService } from './services/business.service';
import { HotelFormDataService } from './services/hotel-form.service';

@NgModule({
  imports: [
    CommonModule,
    AdminBusinessRoutingModule,
    RouterModule,
    AdminSharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [BusinessService, HotelFormDataService],
  declarations: [...AdminBusinessRoutingModule.components],
})
export class AdminBusinessModule {}
