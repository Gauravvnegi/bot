import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CampaignComponent } from './components/campaign/campaign.component';
import { CampaignEmailComponent } from './components/camapaign-email/camapaign-email.component';
import { SendTestComponent } from './components/send-test/send-test.component';
import { ToDropdownComponent } from './components/to-dropdown/to-dropdown.component';
import { ReceiverFieldComponent } from './components/receiver-field/receiver-field.component';
import { CampaignDatatableComponent } from './components/datatable/campaign-datable/campaign-datatable.component';

const appRoutes: Route[] = [
  // { path: '', redirectTo: 'create' },
  { path: '', component: CampaignComponent },
  { path: 'create', component: CampaignEmailComponent },
  { path: 'edit/:id', component: CampaignEmailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminCampaignRoutingModule {
  static components = [
    CampaignComponent,
    CampaignEmailComponent,
    SendTestComponent,
    ToDropdownComponent,
    ReceiverFieldComponent,
    CampaignDatatableComponent,
  ];
}
