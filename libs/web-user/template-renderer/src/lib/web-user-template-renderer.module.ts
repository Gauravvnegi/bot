import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebUserTemplateRendererRoutingModule } from './web-user-template-renderer-routing.module';
import { TemplateRendererDirective } from './directives/template-renderer.directive';
import { TemplateLoaderDirective } from './directives/template-loader.directive';

@NgModule({
  imports: [CommonModule, WebUserTemplateRendererRoutingModule],
  declarations: [
    WebUserTemplateRendererRoutingModule.components,
    TemplateRendererDirective,
    TemplateLoaderDirective,
  ],
})
export class WebUserTemplateRendererModule {}
