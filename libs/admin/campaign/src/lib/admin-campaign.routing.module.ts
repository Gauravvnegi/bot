import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ComingSoonComponent } from 'libs/admin/shared/src/lib/components/coming-soon/coming-soon.component';
import { CampaignComponent } from './components/campaign/campaign.component';
import { CamapaignEmailComponent } from './components/camapaign-email/camapaign-email.component';
import { SendTestComponent } from './components/send-test/send-test.component';

const appRoutes: Route[] = [
  { path: '', redirectTo: 'create' },
  { path: 'create', component: CamapaignEmailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminCampaignRoutingModule {
  static components = [
    CampaignComponent,
    CamapaignEmailComponent,
    SendTestComponent,
  ];
}
