import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebUserTemplateRendererRoutingModule } from './web-user-template-renderer-routing.module';
import { TemplateRendererDirective } from './directives/template-renderer.directive';

@NgModule({
  imports: [CommonModule, WebUserTemplateRendererRoutingModule],
  declarations: [
    WebUserTemplateRendererRoutingModule.components,
    TemplateRendererDirective,
  ],
})
export class WebUserTemplateRendererModule {}
