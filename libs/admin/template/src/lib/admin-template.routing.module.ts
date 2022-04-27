import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { TemplateComponent } from './components/template/template.component';
import { EditTemplateComponent } from './components/edit-template/edit-template.component';
import { CreateTemplateComponent } from './components/create-template/create-template.component';
import { TemplateDatatableComponent } from './components/datatable/template-datatable/template-datatable.component';

const appRoutes: Route[] = [
  { path: '', component: TemplateDatatableComponent },
  { path: 'create', component: CreateTemplateComponent },
  { path: 'edit', component: EditTemplateComponent },
];

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
