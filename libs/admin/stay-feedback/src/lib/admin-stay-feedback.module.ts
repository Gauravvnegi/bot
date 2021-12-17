import {
  ComponentFactory,
  ComponentFactoryResolver,
  NgModule,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { SharedMaterialModule } from '@hospitality-bot/shared/material';
import { ChartsModule } from 'ng2-charts';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { StatisticsService } from '@hospitality-bot/admin/shared';
import { AdminGuestDetailModule } from '@hospitality-bot/admin/guest-detail';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { AdminStayFeedbackRoutingModule } from './admin-stay-feedback.routing.module';
import { FeedbackComponent } from './components/feedback/feedback.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ChartsModule,
    ReactiveFormsModule,
    SharedMaterialModule,
    AdminSharedModule,
    AdminStayFeedbackRoutingModule,
    FlexLayoutModule,
    SlickCarouselModule,
    AdminGuestDetailModule,
    NgCircleProgressModule.forRoot(),
  ],
  declarations: [...AdminStayFeedbackRoutingModule.components],
  providers: [StatisticsService],
})
export class AdminStayFeedbackModule {
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  public resolveComponent(): ComponentFactory<FeedbackComponent> {
    return this.componentFactoryResolver.resolveComponentFactory(
      FeedbackComponent
    );
  }
}
