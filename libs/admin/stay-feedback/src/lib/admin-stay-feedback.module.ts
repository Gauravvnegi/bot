import {
  ComponentFactory,
  ComponentFactoryResolver,
  NgModule,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { SharedMaterialModule } from 'libs/shared/material/src/lib/shared-material.module';
import { ChartsModule } from 'ng2-charts';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { StatisticsService } from 'libs/admin/shared/src/lib/services/feedback-statistics.service';
import { AdminGuestDetailModule } from 'libs/admin/guest-detail/src/lib/admin-guest-detail.module';
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
    // AdminStayFeedbackRoutingModule,
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
