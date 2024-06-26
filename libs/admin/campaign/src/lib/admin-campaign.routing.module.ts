import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CampaignComponent } from './components/campaign/campaign.component';
import { EditCampaignComponent } from './components/edit-campaign/edit-camapaign.component';
import { SendTestComponent } from './components/send-test/send-test.component';
import { ToDropdownComponent } from './components/to-dropdown/to-dropdown.component';
import { ReceiverFieldComponent } from './components/receiver-field/receiver-field.component';
import { ViewCampaignComponent } from './components/view-campaign/view-campaign.component';
import { PersonalizationComponent } from './components/personalization/personalization.component';
import { CampaignFormComponent } from './components/campaign-form/campaign-form.component';
import { CreateContentComponent } from './components/create-content/create-content.component';
import { CampaignDatatableComponent } from './components/datatable/campaign-datable/campaign-datatable.component';
import { EditContentComponent } from './components/edit-content/edit-content.component';
import { TemplateListContainerComponent } from './components/template-list-container/template-list-container.component';
import { TopicTemplatesComponent } from './components/topic-templates/topic-templates.component';
import { ScheduleCampaignComponent } from './components/schedule-campaign/schedule-campaign.component';
import { CampaignFormViewComponent } from './components/campaign-form-view/campaign-form-view.component';
import { campaignRoutes } from './constant/route';

const appRoutes: Route[] = [
  {
    path: '',
    component: CampaignComponent,
    children: [
      {
        path: '',
        component: CampaignDatatableComponent,
      },
      {
        path: campaignRoutes.createEmailCampaign.route,
        component: CampaignComponent,
        children: [
          {
            path: '',
            component: CampaignFormViewComponent,
          },
          {
            path: campaignRoutes.createTemplate.route,
            component: TemplateListContainerComponent,
            pathMatch: 'full',
          },
        ],
      },
      {
        path: `${campaignRoutes.editEmailCampaign.route}/:id`,
        component: CampaignComponent,
        children: [
          {
            path: '',
            component: CampaignFormViewComponent,
          },
          {
            path: campaignRoutes.createTemplate.route,
            component: TemplateListContainerComponent,
            pathMatch: 'full',
          },
        ],
      },
    ],
  },
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
    ViewCampaignComponent,
    PersonalizationComponent,
    CampaignFormComponent,
    CreateContentComponent,
    EditContentComponent,
    TemplateListContainerComponent,
    TopicTemplatesComponent,
    ScheduleCampaignComponent,
    CampaignFormViewComponent,
  ];
}
