import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CampaignComponent } from './components/campaign/campaign.component';
import { CamapaignEmailComponent } from './components/camapaign-email/camapaign-email.component';
import { SendTestComponent } from './components/send-test/send-test.component';
import { ToDropdownComponent } from './components/to-dropdown/to-dropdown.component';
import { ReceiverFieldComponent } from './components/receiver-field/receiver-field.component';
import { CampaignDatableComponent } from './components/datatable/campaign-datable/campaign-datable.component';

const appRoutes: Route[] = [
  // { path: '', redirectTo: 'create' },
  { path: '', component: CampaignComponent },
  { path: 'create', component: CamapaignEmailComponent },
  { path: 'edit/:id', component: CamapaignEmailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
  declarations: [],
})
export class AdminCampaignRoutingModule {
  static components = [
    CampaignComponent,
    CamapaignEmailComponent,
    SendTestComponent,
    ToDropdownComponent,
    ReceiverFieldComponent,
    CampaignDatableComponent,
  ];
}
