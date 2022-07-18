import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminTemplateRoutingModule } from './admin-template.routing.module';
import {
  AdminSharedModule,
  getTranslationConfigs,
} from '@hospitality-bot/admin/shared';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TemplateService } from './services/template.service';

@NgModule({
  imports: [
    CommonModule,
    AdminTemplateRoutingModule,
    AdminSharedModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(getTranslationConfigs([HttpClient], ['template'])),
  ],
  declarations: [...AdminTemplateRoutingModule.components],
  providers: [TemplateService],
})
export class AdminTemplateModule {}
