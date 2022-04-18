import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { TopicDatatableComponent } from './components/datatable/topic-datatable/topic-datatable.component';
import { TopicComponent } from './components/topic/topic.component';
import { EditTopicComponent } from './components/edit-topic/edit-topic.component';

const appRoutes: Route[] = [
  { path: '', component: TopicComponent },
  { path: 'create', component: EditTopicComponent },
  { path: 'edit/:id', component: EditTopicComponent}
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
