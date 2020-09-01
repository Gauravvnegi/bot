import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { TemplateRendererComponent } from './containers/template-renderer/template-renderer.component';
import { TempLoader000001Component } from './template-loaders/temp-loader000001/temp-loader000001.component';

export const sharedAuthRoutes: Route[] = [
  {
    path: '',
    component: TemplateRendererComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(sharedAuthRoutes)],
  exports: [RouterModule],
  providers: [],
})
export class WebUserTemplateRendererRoutingModule {
  static components = [TemplateRendererComponent, TempLoader000001Component];
}
