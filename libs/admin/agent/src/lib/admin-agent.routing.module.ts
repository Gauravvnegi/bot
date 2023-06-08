import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AgentDataTableComponent } from './components/agent-data-table/agent-data-table.component';
import { MainComponent } from './components/main/main.component';
const appRoutes: Route[] = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        component: AgentDataTableComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminAgentRoutingModule {
  static components = [MainComponent, AgentDataTableComponent];
}
