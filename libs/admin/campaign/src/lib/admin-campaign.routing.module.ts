import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ComingSoonComponent } from 'libs/admin/shared/src/lib/components/coming-soon/coming-soon.component';
import { CampaignComponent } from './campaign/campaign.component';

const appRoutes: Route[] = [{ path: '', component: ComingSoonComponent }];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminCampaignRoutingModule {
  static components = [CampaignComponent];
}
