import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/services/api.service';
import { Observable } from 'rxjs';
import { FeedbackConfig } from '../models/feedbackConfig.model';

@Injectable({ providedIn: 'root' })
export class FeedbackService extends ApiService {
  feedbackConfig;
  initFeedbackConfig(data) {
    this.feedbackConfig = new FeedbackConfig().deserialize(data);
  }

  getFeedbackConfig(): Observable<any> {
    return this.get(`/api/v1/cms/feedback-form`);
  }

  getServiceUrl(serviceId) {
    return (
      this.feedbackConfig.suggestionsObj[serviceId] &&
      this.feedbackConfig.suggestionsObj[serviceId].url
    );
  }
}
