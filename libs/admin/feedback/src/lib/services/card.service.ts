import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { BehaviorSubject, Observable } from 'rxjs';
import { feedback } from '../constants/feedback';

@Injectable()
export class CardService extends ApiService {
  $selectedFeedback = new BehaviorSubject(null);
  $selectedEntityType = new BehaviorSubject(null);
  $tabValues = new BehaviorSubject(null);
  $assigneeChange = new BehaviorSubject({ status: false });
  $refreshList = new BehaviorSubject(false);
  getFeedbackList(config) {
    return this.get(`/api/v1/feedback/guests-card${config.queryObj}`);
  }

  getGuestRequestData(guestId) {
    return this.get(`/api/v1/request/${guestId}/guest`);
  }
  getGuestReservations(guestId: string): Observable<any> {
    return this.get(`/api/v1/members/${guestId}/reservations`);
  }
  getGuestById(guestId: string): Observable<any> {
    return this.get(`/api/v1/members/${guestId}`);
  }
  getDepartmentList(hotelId: string, feedbackType: string) {
    return this.get(
      `/api/v1/cms/entity/${hotelId}/feedback-form?key=${feedbackType === feedback.types.stay
        ? 'departments'
        : 'transactionaldepartments'
      }`
    );
  }

  getUsersList(hotelId: string) {
    return this.get(`/api/v1/entity/${hotelId}/users`);
  }

  searchFeedbacks(config) {
    return this.get(`/api/v1/feedback/guests/search${config.queryObj}`);
  }

  updateFeedbackAssignee(feedbackId, asigneeId) {
    return this.patch(
      `/api/v1/feedback/update/${feedbackId}?asigneeId=${asigneeId}`,
      {}
    );
  }

  getFeedbackPdf(id: string): Observable<any> {
    return this.get(`/api/v1/feedback/${id}/download-feedback-form`);
  }

  getFeedbackByID(id: string) {
    return this.get(`/api/v1/feedback/${id}`);
  }

  getFeedbackNotificationData(id: string) {
    return this.get(`/api/v1/feedback/${id}/notification-data`);
  }
}
