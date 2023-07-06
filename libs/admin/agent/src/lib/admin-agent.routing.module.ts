import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AgentDataTableComponent } from './components/agent-data-table/agent-data-table.component';
import { MainComponent } from './components/main/main.component';
import { AddAgentComponent } from './components/add-agent/add-agent.component';
import { agentRoutes } from './constant/routes';
import { CompanyListComponent } from './components/company-list/company-list.component';
import { CompanyService } from 'libs/admin/company/src/lib/services/company.service';
const appRoutes: Route[] = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        component: AgentDataTableComponent,
      },
      {
        path: agentRoutes.addAgent.route,
        component: AddAgentComponent,
      },
      {
        path: `${agentRoutes.editAgent.route}/:id`,
        component: AddAgentComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
  providers: [CompanyService],
})
export class AdminAgentRoutingModule {
  static components = [
    MainComponent,
    AgentDataTableComponent,
    AddAgentComponent,
    CompanyListComponent,
  ];
}
