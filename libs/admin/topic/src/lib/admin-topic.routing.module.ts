import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CreateTopicComponent } from './components/create-topic/create-topic.component';
import { TopicDatatableComponent } from './components/datatable/topic-datatable/topic-datatable.component';
import { TopicComponent } from './components/topic/topic.component';

const appRoutes: Route[] = [
  { path: '', component: TopicComponent },
  { path: 'create', component: CreateTopicComponent },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
  declarations: [],
})
export class AdminTopicRoutingModule {
  static components = [
    CreateTopicComponent,
    TopicComponent,
    TopicDatatableComponent,
  ];
}
