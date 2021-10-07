import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class FeedbackTableService extends ApiService {
  getGuestFeedbacks(config) {
    return this.get(`/api/v1/transactional-feedback/guests${config.queryObj}`);
  }

  updateNotes(id, data) {
    return this.patch(`/api/v1/transactional-feedback/${id}/notes`, data);
  }

  getFeedbackPdf(id) {
    return this.get(
      `/api/v1/transactional-feedback/${id}/download-feedback-form`
    );
  }

  exportCSV(config) {
    return this.get(`/api/v1/transactional-feedback/export${config.queryObj}`, {
      responseType: 'blob',
    });
  }

  updateFeedbackStatus(config, data) {
    return this.patch(
      `/api/v1/transactional-feedback/status${config.queryObj}`,
      data
    );
  }
}
