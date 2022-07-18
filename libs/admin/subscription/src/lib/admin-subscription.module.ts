import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSubscriptionRoutingModule } from './admin-subscription.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { SharedMaterialModule } from 'libs/shared/material/src';
import { RouterModule } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { ChartsModule } from 'ng2-charts';
import { SubscriptionService } from './services/subscription.service';
import { SlickCarouselModule } from 'ngx-slick-carousel';
@NgModule({
  imports: [
    CommonModule,
    AdminSubscriptionRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AdminSharedModule,
    RouterModule,
    TableModule,
    SharedMaterialModule,
    SlickCarouselModule,
    DropdownModule,
    ChartsModule,
  ],
  declarations: [AdminSubscriptionRoutingModule.components],
  providers: [SubscriptionService],
})
export class AdminSubscriptionModule {}
