import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { TopicDatatableComponent } from './components/datatable/topic-datatable/topic-datatable.component';
import { TopicComponent } from './components/topic/topic.component';
import { EditTopicComponent } from './components/edit-topic/edit-topic.component';
import { TopicRoutes } from './constants/routes';

const appRoutes: Route[] = [
  { path: TopicRoutes.createTopic.route, component: EditTopicComponent },
  { path: TopicRoutes.editTopic.route, component: EditTopicComponent },
  { path: TopicRoutes.topic.route, component: TopicComponent },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
  declarations: [],
})
export class AdminTopicRoutingModule {
  static components = [
    EditTopicComponent,
    TopicComponent,
    TopicDatatableComponent,
  ];
}
