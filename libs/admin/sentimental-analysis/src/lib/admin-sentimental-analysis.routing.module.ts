import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { OverallSentimentComponent } from './components/overall-sentiment/overall-sentiment.component';
import { SentimentDatatableComponent } from './components/sentiment-datatable/sentiment-datatable.component';
import { SentimentsByTopicsComponent } from './components/sentiments-by-topics/sentiments-by-topics.component';
import { SentimentsOverTimeComponent } from './components/sentiments-over-time/sentiments-over-time.component';
import { SentimentsRatingComponent } from './components/sentiments-rating/sentiments-rating.component';
import { TopicsOverTimeComponent } from './components/topics-over-time/topics-over-time.component';
import { TopicsComponent } from './components/topics/topics.component';
import { WordCloudComponent } from './components/word-cloud/word-cloud.component';

export const adminRoomRoutes: Route[] = [
  { path: '', component: MainComponent },
];

@NgModule({
  imports: [RouterModule.forChild(adminRoomRoutes)],
  exports: [RouterModule],
})
export class AdminSentimentalAnalysisRoutingModule {
  static components = [
    MainComponent,
    OverallSentimentComponent,
    SentimentDatatableComponent,
    SentimentsByTopicsComponent,
    SentimentsOverTimeComponent,
    SentimentsRatingComponent,
    TopicsComponent,
    TopicsOverTimeComponent,
    WordCloudComponent,
  ];
}
