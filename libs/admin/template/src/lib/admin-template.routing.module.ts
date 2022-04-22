import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ComingSoonComponent } from 'libs/admin/shared/src/lib/components/coming-soon/coming-soon.component';
import { TemplateComponent } from './components/template/template.component';

const appRoutes: Route[] = [{ path: '', component: ComingSoonComponent }];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminTemplateRoutingModule {
  static components = [TemplateComponent];
}
