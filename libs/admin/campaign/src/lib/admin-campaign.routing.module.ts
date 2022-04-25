import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ComingSoonComponent } from 'libs/admin/shared/src/lib/components/coming-soon/coming-soon.component';
import { CampaignComponent } from './components/campaign/campaign.component';
import { CreateCampaignComponent } from './components/create-campaign/create-campaign.component';

const appRoutes: Route[] = [
  { path: '', component: ComingSoonComponent },
  { path: 'create', component: CreateCampaignComponent },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminCampaignRoutingModule {
  static components = [CampaignComponent, CreateCampaignComponent];
}
