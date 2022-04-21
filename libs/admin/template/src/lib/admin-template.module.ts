import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminTemplateRoutingModule } from './admin-template.routing.module';

@NgModule({
  imports: [CommonModule, AdminTemplateRoutingModule],
  declarations: [...AdminTemplateRoutingModule.components],
})
export class AdminTemplateModule {}
