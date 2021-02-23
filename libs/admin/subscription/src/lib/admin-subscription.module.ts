import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSubscriptionRoutingModule } from './admin-subscription.routing.module';

@NgModule({
  imports: [CommonModule, AdminSubscriptionRoutingModule],
  declarations: [AdminSubscriptionRoutingModule.components],
})
export class AdminSubscriptionModule {}
