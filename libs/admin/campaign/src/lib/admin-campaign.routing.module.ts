import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CampaignComponent } from './components/campaign/campaign.component';
import { EditCampaignComponent } from './components/edit-campaign/edit-camapaign.component';
import { SendTestComponent } from './components/send-test/send-test.component';
import { ToDropdownComponent } from './components/to-dropdown/to-dropdown.component';
import { ReceiverFieldComponent } from './components/receiver-field/receiver-field.component';
import { CampaignDatatableComponent } from './components/datatable/campaign-datable/campaign-datatable.component';

const appRoutes: Route[] = [
  // { path: '', redirectTo: 'create' },
  { path: '', component: CampaignComponent },
  { path: 'create', component: EditCampaignComponent },
  { path: 'edit/:id', component: EditCampaignComponent },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminCampaignRoutingModule {
  static components = [
    CampaignComponent,
    EditCampaignComponent,
    SendTestComponent,
    ToDropdownComponent,
    ReceiverFieldComponent,
    CampaignDatatableComponent,
  ];
}
