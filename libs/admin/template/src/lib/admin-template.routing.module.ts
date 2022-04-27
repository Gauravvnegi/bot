import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ComingSoonComponent } from 'libs/admin/shared/src/lib/components/coming-soon/coming-soon.component';
import { TemplateComponent } from './components/template/template.component';
import { EditTemplateComponent } from './components/edit-template/edit-template.component';
import { CreateTemplateComponent } from './components/create-template/create-template.component';
import { TemplateDatatableComponent } from './components/datatable/template-datatable/template-datatable.component';

const appRoutes: Route[] = [{ path: '', component: ComingSoonComponent }];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
  declarations: [],
})
export class AdminTemplateRoutingModule {
  static components = [
    TemplateComponent,
    TemplateDatatableComponent,
    EditTemplateComponent,
    CreateTemplateComponent,
  ];
}
