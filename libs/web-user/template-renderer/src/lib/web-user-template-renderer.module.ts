import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TemplateRendererDirective } from './directives/template-renderer.directive';
import { WebUserTemplateRendererRoutingModule } from './web-user-template-renderer-routing.module';

@NgModule({
  imports: [CommonModule, WebUserTemplateRendererRoutingModule],
  declarations: [
    ...WebUserTemplateRendererRoutingModule.components,
    TemplateRendererDirective,
  ],
})
export class WebUserTemplateRendererModule {}
