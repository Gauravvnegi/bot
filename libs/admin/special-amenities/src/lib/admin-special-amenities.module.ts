import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { AdminSpecialAmenitiesRoutingModule } from './admin-special-amenities.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedMaterialModule } from 'libs/shared/material/src';
import { SpecialAmenitiesComponent } from './components/special-amenities/special-amenities.component';
import { SpecialAmenitiesService } from './services/special-amenities.service';

@NgModule({
  imports: [
    CommonModule, 
    FormsModule,
    ReactiveFormsModule,
    AdminSharedModule, 
    RouterModule,
    SharedMaterialModule,
    AdminSpecialAmenitiesRoutingModule
  ],
  declarations: [SpecialAmenitiesComponent],
  providers: [
    SpecialAmenitiesService
  ]
})
export class AdminSpecialAmenitiesModule {}
