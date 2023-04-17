import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { AdminServicesRoutingModule } from './admin-services.routing.module';
import { ServicesService } from './services/services.service';
import { AdminLibraryModule } from '@hospitality-bot/admin/library';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AdminServicesRoutingModule,
    AdminSharedModule,
    FormsModule,
    ReactiveFormsModule,
    AdminLibraryModule,
  ],
  declarations: [...AdminServicesRoutingModule.components],
  providers: [ServicesService],
})
export class AdminServicesModule {}
