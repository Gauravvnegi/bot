import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { TemplateComponent } from './components/template/template.component';

const appRoutes: Route[] = [{ path: '', component: TemplateComponent }];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminTemplateRoutingModule {
  static components = [TemplateComponent];
}
