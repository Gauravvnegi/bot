import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { TemplateRendererComponent } from './containers/template-renderer/template-renderer.component';

export const sharedAuthRoutes: Route[] = [
  {
    path: '',
    component: TemplateRendererComponent,
  },
  {
    path: '**',
    component: TemplateRendererComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(sharedAuthRoutes)],
  exports: [RouterModule],
  providers: [],
})
export class WebUserTemplateRendererRoutingModule {
  static readonly components: any[] = [TemplateRendererComponent];
}
