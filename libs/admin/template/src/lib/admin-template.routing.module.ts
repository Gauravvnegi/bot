import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { TemplateComponent } from './components/template/template.component';
import { EditTemplateComponent } from './components/edit-template/edit-template.component';

const appRoutes: Route[] = [{ path: '', component:EditTemplateComponent }];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminTemplateRoutingModule {
  static components = [TemplateComponent,EditTemplateComponent];
}
