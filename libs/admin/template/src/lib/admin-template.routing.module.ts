import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { TemplateComponent } from './components/template/template.component';
import { EditTemplateComponent } from './components/edit-template/edit-template.component';
import { TemplateDatatableComponent } from './components/datatable/template-datatable/template-datatable.component';
import { TemplateHtmlEditorComponent } from './components/template-html-editor/template-html-editor.component';
import { InbuiltTemplateComponent } from './components/inbuilt-template/inbuilt-template.component';
import { ImportAssetComponent } from './components/import-asset/import-asset.component';

const appRoutes: Route[] = [
  { path: '', component: TemplateDatatableComponent },
  { path: 'create', component: EditTemplateComponent },
  { path: 'edit/:id', component: EditTemplateComponent },
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
    TemplateHtmlEditorComponent,
    InbuiltTemplateComponent,
    ImportAssetComponent,
  ];
}
