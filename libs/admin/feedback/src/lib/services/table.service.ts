import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { UpdateNoteData, UpdateStatusData } from '../types/feedback.type';

/**
 * @class Manages api calls for feedback table.
 */
@Injectable()
export class FeedbackTableService extends ApiService {
  $feedbackType = new BehaviorSubject('');
  /**
   * @function To get guest feedback list.
   * @param config The filter config data.
   * @returns The observable with guest feedback data.
   */
  getGuestFeedbacks(config): Observable<any> {
    return this.get(`/api/v1/feedback/guests${config.queryObj}`);
  }

  /**
   * @function updateNotes To update notes for a feedback.
   * @param id The feedback id.
   * @param data The notes data.
   * @returns The observable with updated notes data.
   */
  updateNotes(id: string, data: UpdateNoteData): Observable<any> {
    return this.patch(`/api/v1/feedback/${id}/notes`, data);
  }

  /**
   * @function getFeedbackPdf To get feedback pdf for a feedback.
   * @param id The feedback id.
   * @returns The observable with feedback pdf.
   */
  getFeedbackPdf(id: string): Observable<any> {
    return this.get(`/api/v1/feedback/${id}/download-feedback-form`);
  }

  /**
   * @function To get CSV report for feedback table.
   * @param config The filter config data.
   * @returns The observable with CSV blob.
   */
  exportCSV(config): Observable<any> {
    return this.get(`/api/v1/feedback/export${config.queryObj}`, {
      responseType: 'blob',
    });
  }

  /**
   * @function updateFeedbackStatus To update feedback status.
   * @param config The filter config data.
   * @param data The feedback status data.
   * @returns The observable with updated feedback data.
   */
  updateFeedbackStatus(config, data: UpdateStatusData): Observable<any> {
    return this.patch(`/api/v1/feedback/status${config.queryObj}`, data);
  }
}
