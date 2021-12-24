import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  AdminSharedModule,
  getTranslationConfigs,
} from '@hospitality-bot/admin/shared';
import { AdminFeedbackRoutingModule } from './admin-feedback.routing.module';
import { SharedMaterialModule } from 'libs/shared/material/src/lib/shared-material.module';
import { ChartsModule } from 'ng2-charts';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { AdminGuestDetailModule } from '@hospitality-bot/admin/guest-detail';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { HttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ChartsModule,
    ReactiveFormsModule,
    SharedMaterialModule,
    AdminSharedModule,
    AdminFeedbackRoutingModule,
    FlexLayoutModule,
    SlickCarouselModule,
    AdminGuestDetailModule,
    NgCircleProgressModule.forRoot(),

    TranslateModule.forChild(
      getTranslationConfigs(
        [HttpClient],
        ['feedback', 'stay-feedback', 'transactional-feedback']
      )
    ),
  ],
  declarations: [...AdminFeedbackRoutingModule.components],
})
export class AdminFeedbackModule {}
