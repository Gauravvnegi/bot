import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { TemplateDatatableComponent } from './components/datatable/template-datatable/template-datatable.component';
import { TemplateComponent } from './components/template/template.component';

const appRoutes: Route[] = [
  { path: '', component: TemplateDatatableComponent },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
  declarations: [],
})
export class AdminTemplateRoutingModule {
  static components = [TemplateComponent, TemplateDatatableComponent];
}
