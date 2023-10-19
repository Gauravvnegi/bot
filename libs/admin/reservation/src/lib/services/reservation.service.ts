import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { Observable } from 'rxjs';

@Injectable()
export class ReservationService extends ApiService {
  getReservationDetails(reservationId): Observable<any> {
    return this.get(`/api/v1/reservation/${reservationId}?raw=true`);
  }

  getCountryList(): Observable<any> {
    return this.get(`/api/v1/countries`);
  }

  getDocumentsByNationality(entityId, nationality): Observable<any> {
    return this.get(
      `/api/v1/entity/${entityId}/support-documents?nationality=${nationality}`
    );
  }

  updateStepStatus(reservationId, data): Observable<any> {
    return this.put(`/api/v1/reservation/${reservationId}/verify-steps`, data);
  }

  updateJourneyStatus(reservationId, data): Observable<any> {
    return this.put(
      `/api/v1/reservation/${reservationId}/verify-journey`,
      data
    );
  }

  downloadInvoice(reservationId): Observable<any> {
    return this.get(`/api/v1/reservation/${reservationId}/invoice`);
  }

  prepareInvoice(reservationId, data = {}): Observable<any> {
    return this.put(
      `/api/v1/reservation/${reservationId}/prepare-invoice`,
      data
    );
  }

  uploadDocumentFile(reservationId, guestId, formData): Observable<any> {
    return this.uploadDocument(
      `/api/v1/reservation/${reservationId}/guest/${guestId}/documents/upload`,
      formData
    );
  }

  saveDocument(reservationId, data): Observable<any> {
    return this.patch(`/api/v1/reservation/${reservationId}/documents`, data);
  }

  generateJourneyLink(reservationId, journeyName): Observable<any> {
    return this.get(
      `/api/v1/reservation/${reservationId}/generate-link?journey=${journeyName}`
    );
  }

  generateFeedback(reservationId): Observable<any> {
    return this.get(
      `/api/v1/reservation/${reservationId}/generate-link?surveyType=FEEDBACK`
    );
  }

  checkCurrentWindow(reservationId): Observable<any> {
    return this.get(`/api/v1/reservation/${reservationId}/journey-window`);
  }

  getRequestsByReservationId(reservationId, config): Observable<any> {
    return this.get(`/api/v1/reservation/${reservationId}/live-request`);
  }

  updateDepositRule(reservationId, data) {
    return this.put(`/api/v1/reservation/${reservationId}/deposit-rules`, data);
  }

  updateRequest(reservationId, config) {
    return this.post(
      `/api/v1/reservation/${reservationId}/verify-request`,
      config
    );
  }

  manualCheckin(reservationId, data) {
    return this.post(
      `/api/v1/reservation/${reservationId}/manual-checkin`,
      data
    );
  }

  manualCheckout(reservationId) {
    return this.post(
      `/api/v1/reservation/${reservationId}/manual-checkout`,
      {}
    );
  }

  getGuestById(guestId: string): Observable<any> {
    return this.get(`/api/v1/members/${guestId}`);
  }

  getGuestReservations(guestId: string): Observable<any> {
    return this.get(`/api/v1/members/${guestId}/reservations`);
  }

  /**
   * @function getFeedbackPdf To get feedback pdf for a feedback.
   * @param id The feedback id.
   * @returns The observable with feedback pdf.
   */
  getFeedbackPdf(id: string): Observable<any> {
    return this.get(`/api/v1/feedback/${id}/download-feedback-form`);
  }
}
