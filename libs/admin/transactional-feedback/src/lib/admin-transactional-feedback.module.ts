import {
  ComponentFactory,
  ComponentFactoryResolver,
  NgModule,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  AdminSharedModule,
  getTranslationConfigs,
} from '@hospitality-bot/admin/shared';
import { SharedMaterialModule } from 'libs/shared/material/src/lib/shared-material.module';
import { ChartsModule } from 'ng2-charts';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { StatisticsService } from 'libs/admin/shared/src/lib/services/feedback-statistics.service';
import { AdminGuestDetailModule } from 'libs/admin/guest-detail/src/lib/admin-guest-detail.module';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { AdminTransactionalFeedbackRoutingModule } from './admin-transactional-feedback.routing.module';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { FeedbackTableService } from './services/table.service';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ChartsModule,
    ReactiveFormsModule,
    SharedMaterialModule,
    AdminSharedModule,
    // AdminTransactionalFeedbackRoutingModule,
    FlexLayoutModule,
    SlickCarouselModule,
    AdminGuestDetailModule,
    NgCircleProgressModule.forRoot(),
    TranslateModule.forChild(
      getTranslationConfigs(
        [HttpClient],
        ['feedback', 'transactional-feedback']
      )
    ),
  ],
  declarations: [...AdminTransactionalFeedbackRoutingModule.components],
  providers: [StatisticsService, FeedbackTableService],
})
export class AdminTransactionalFeedbackModule {
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  public resolveComponent(): ComponentFactory<FeedbackComponent> {
    return this.componentFactoryResolver.resolveComponentFactory(
      FeedbackComponent
    );
  }
}
