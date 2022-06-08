import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class CardService extends ApiService {
  $selectedFeedback = new BehaviorSubject(null);
  $selectedEntityType = new BehaviorSubject(null);
  getFeedbackList(config) {
    return this.get(`/api/v1/feedback/guests-card${config.queryObj}`);
  }

  getDepartmentList(hotelId: string) {
    return this.get(
      `/api/v1/cms/hotel/${hotelId}/feedback-form?key=departments`
    );
  }

  getUsersList(hotelId: string) {
    return this.get(`/api/v1/hotel/${hotelId}/users`);
  }

  searchFeedbacks(config) {
    return this.get(`/api/v1/feedback/guests/search${config.queryObj}`);
  }
}
