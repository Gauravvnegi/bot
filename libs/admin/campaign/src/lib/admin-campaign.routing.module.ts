import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CampaignComponent } from './components/campaign/campaign.component';
import { CamapaignEmailComponent } from './components/camapaign-email/camapaign-email.component';
import { SendTestComponent } from './components/send-test/send-test.component';
import { ToDropdownComponent } from './components/to-dropdown/to-dropdown.component';
import { ReceiverFieldComponent } from './components/receiver-field/receiver-field.component';
import { CampaignDatatableComponent } from './components/datatable/campaign-datatable/campaign-datatable/campaign-datatable.component';
import { ComingSoonComponent } from 'libs/admin/shared/src/lib/components/coming-soon/coming-soon.component';

const appRoutes: Route[] = [
  { path: '', redirectTo: 'create' },
  // { path: '', component: CampaignComponent },
  { path: 'create', component: CamapaignEmailComponent },
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
    CampaignDatatableComponent
  ];
}
