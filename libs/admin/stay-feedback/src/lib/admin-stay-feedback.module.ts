import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  ComponentFactory,
  ComponentFactoryResolver,
  NgModule,
} from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminGuestDetailModule } from '@hospitality-bot/admin/guest-detail';
import {
  AdminSharedModule,
  getTranslationConfigs,
  StatisticsService,
} from '@hospitality-bot/admin/shared';
import { SharedMaterialModule } from '@hospitality-bot/shared/material';
import { TranslateModule } from '@ngx-translate/core';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { ChartsModule } from 'ng2-charts';
import { SlickCarouselModule } from 'ngx-slick-carousel';
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
    TranslateModule.forChild(
      getTranslationConfigs([HttpClient], ['stay-feedback'])
    ),
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
