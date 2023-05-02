import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { AdminManageSitesRoutingModule } from './admin-manage-sites.routing.module';
import { ManageSitesService } from './services/manage-sites.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AdminManageSitesRoutingModule,
    AdminSharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [...AdminManageSitesRoutingModule.components],
  providers: [ManageSitesService],
})
export class AdminManageSitesModule {}
