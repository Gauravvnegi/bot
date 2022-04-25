import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminTemplateRoutingModule } from './admin-template.routing.module';
import {
  AdminSharedModule,
  getTranslationConfigs,
} from '@hospitality-bot/admin/shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { TemplateService } from './services/template.service';

@NgModule({
  imports: [CommonModule, AdminTemplateRoutingModule],
  declarations: [...AdminTemplateRoutingModule.components],
  providers: [TemplateService],
})
export class AdminTemplateModule {}
