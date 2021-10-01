import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';

@Injectable()
export class FeedbackTableService extends ApiService {
  getGuestFeedbacks(config) {
    return this.get(`/api/v1/transactional-feedback/guests${config.queryObj}`);
  }

  updateNotes(id, data) {
    return this.patch(`/api/v1/transactional-feedback/${id}/remarks`, data);
  }

  getFeedbackPdf(id) {
    return this.get(
      `/api/v1/transactional-feedback/${id}/download-feedback-form`
    );
  }
}
