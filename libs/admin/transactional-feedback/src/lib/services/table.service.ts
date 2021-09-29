import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';

@Injectable()
export class FeedbackTableService extends ApiService {
  getGuestFeedbacks(config) {
    return this.get(`/api/v1/transactional-feedback/guests${config.queryObj}`);
  }
}
