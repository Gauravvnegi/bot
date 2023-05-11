import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { AdminBusinessRoutingModule } from './admin-business.routing.module';
import { HotelService } from './services/hotel.service';
import { BrandService } from './services/brand.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    AdminBusinessRoutingModule,
    RouterModule,
    AdminSharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [HotelService, BrandService],
  declarations: [...AdminBusinessRoutingModule.components],
})
export class AdminBusinessModule {}