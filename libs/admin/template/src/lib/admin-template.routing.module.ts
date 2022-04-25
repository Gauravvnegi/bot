import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { TemplateComponent } from './components/template/template.component';
import { InbuiltTemplateComponent } from './components/inbuilt-template/inbuilt-template.component';
import { CheckInComponent } from './components/check-in/check-in.component';
import { PreCheckInComponent } from './components/pre-check-in/pre-check-in.component';
import { GeneralComponent } from './components/general/general.component';
const appRoutes: Route[] = [
  { path: '', component: TemplateComponent },
  { path: 'template', component: InbuiltTemplateComponent },
  { path: '', component: CheckInComponent },
  { path: '', component: PreCheckInComponent },
  { path: '', component: GeneralComponent },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminTemplateRoutingModule {
  static components = [
    TemplateComponent,
    InbuiltTemplateComponent,
    CheckInComponent,
    PreCheckInComponent,
    GeneralComponent,
  ];
}
