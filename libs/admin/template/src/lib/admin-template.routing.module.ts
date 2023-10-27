import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { TemplateComponent } from './components/template/template.component';
import { EditTemplateComponent } from './components/edit-template/edit-template.component';
import { TemplateDatatableComponent } from './components/datatable/template-datatable/template-datatable.component';
import { TemplateHtmlEditorComponent } from './components/template-html-editor/template-html-editor.component';
import { ImportAssetComponent } from './components/import-asset/import-asset.component';
import { TemplateListContainerComponent } from './components/template-list-container/template-list-container.component';
import { TopicTemplatesComponent } from './components/topic-templates/topic-templates.component';
import { templateRoutes } from './constants/routes';

const appRoutes: Route[] = [
  {
    path: '',
    component: TemplateComponent,
    children: [
      { path: '', component: TemplateDatatableComponent },
      {
        path: templateRoutes.createTemplate.route,
        component: TemplateComponent,
        children: [
          { path: '', component: EditTemplateComponent },
          {
            path: templateRoutes.savedTemplate.route,
            component: TemplateListContainerComponent,
          },
          {
            path: templateRoutes.preDesignedTemplate.route,
            component: TemplateListContainerComponent,
          },
          {
            path: templateRoutes.htmlEditorTemplate.route,
            component: TemplateHtmlEditorComponent,
          },
        ],
      },
      {
        path: templateRoutes.editTemplate.route,
        component: TemplateComponent,
        children: [
          { path: '', component: EditTemplateComponent },
          {
            path: templateRoutes.savedTemplate.route,
            component: TemplateListContainerComponent,
          },
          {
            path: templateRoutes.preDesignedTemplate.route,
            component: TemplateListContainerComponent,
          },
          {
            path: templateRoutes.htmlEditorTemplate.route,
            component: TemplateHtmlEditorComponent,
          },
          { path: 'edit/html-editor', component: TemplateHtmlEditorComponent },
          { path: 'view/html-editor', component: TemplateHtmlEditorComponent },
        ],
      },
    ],
  },
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
    ImportAssetComponent,
    TemplateListContainerComponent,
    TopicTemplatesComponent,
  ];
}
