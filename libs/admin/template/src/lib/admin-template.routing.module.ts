import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CheckInComponent } from './components/check-in/check-in.component';
import { TemplateDatatableComponent } from './components/datatable/template-datatable/template-datatable.component';
import { GeneralComponent } from './components/general/general.component';
import { InbuiltTemplateComponent } from './components/inbuilt-template/inbuilt-template.component';
import { PreCheckInComponent } from './components/pre-check-in/pre-check-in.component';
import { TemplateComponent } from './components/template/template.component';

const appRoutes: Route[] = [
  { path: '', component: TemplateComponent },
  { path: 'template', component: InbuiltTemplateComponent },
  { path: '', component: CheckInComponent },
  { path: '', component: PreCheckInComponent },
  { path: '', component: GeneralComponent },
  { path: '', component: TemplateDatatableComponent },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
  declarations: [],
})
export class AdminTemplateRoutingModule {
  static components = [
    GeneralComponent,
    PreCheckInComponent,
    CheckInComponent,
    InbuiltTemplateComponent,
    TemplateComponent,
    TemplateDatatableComponent,
  ];
}
