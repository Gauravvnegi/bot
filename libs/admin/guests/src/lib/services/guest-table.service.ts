import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { Observable } from 'rxjs';
import { FeedbackConfigI } from '../data-models/feedbackDetailsConfig.model';

@Injectable()
export class GuestTableService extends ApiService {
  getGuestList(config): Observable<any> {
    return this.get(`/api/v1/guests${config.queryObj}`);
  }

  getGuestById(guestId: string): Observable<any> {
    return this.get(`/api/v1/guest/${guestId}`);
  }

  getReservationFeedback(reservationId: string): Observable<any> {
    return this.get(`/api/v1/reservation/${reservationId}/feedback`);
  }

  getReservationDetail(bookingId: string): Observable<any> {
    return this.get(`/api/v1/reservation/${bookingId}?raw=true`);
  }

  getGuestReservations(guestId: string): Observable<any> {
    return this.get(`/api/v1/guest/${guestId}/reservations`);
  }

  getGuestReservationById(guestId: string, reservationId: string) {
    return this.get(`/api/v1/guest/${guestId}/reservations/${reservationId}`);
  }

  exportCSV(config): Observable<any> {
    return this.get(`/api/v1/guest/export/${config.queryObj}`, {
      responseType: 'blob',
    });
  }

  getFeedback(hotelId): Observable<FeedbackConfigI> {
    return this.get(`/api/v1/cms/feedback-form`);
  }

  getAllGuestStatus(config): Observable<any> {
    return this.get(`/api/v1/guests/status/${config.queryObj}`);
  }

  getAllGuestPayments(config): Observable<any> {
    return this.get(`/api/v1/guests/payments/${config.queryObj}`);
  }

  getAllGuestDocuments(config): Observable<any> {
    return this.get(`/api/v1/guests/documents/${config.queryObj}`);
  }
}
