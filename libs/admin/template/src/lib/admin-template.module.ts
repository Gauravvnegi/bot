import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminTemplateRoutingModule } from './admin-template.routing.module';
import {
  AdminSharedModule,
  getTranslationConfigs,
} from '@hospitality-bot/admin/shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TemplateService } from './services/template.service';
import { HttpClient } from '@angular/common/http';
@NgModule({
  imports: [
    CommonModule,
    AdminTemplateRoutingModule,
    AdminSharedModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(getTranslationConfigs([HttpClient], ['topic'])),
  ],
  declarations: [...AdminTemplateRoutingModule.components],
  providers: [TemplateService],
})
export class AdminTemplateModule {}
