import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/services/api.service';
import { Observable } from 'rxjs';
import { FeedbackConfigI } from '../data-models/feedbackDetailsConfig.model';
import { SearchGuestResponse } from '../types/guest.type';

@Injectable()
export class GuestTableService extends ApiService {
  getGuestList(config): Observable<any> {
    return this.get(`/api/v1/members${config.queryObj}`);
  }

  getGuestById(guestId: string): Observable<any> {
    return this.get(`/api/v1/guest/${guestId}`);
  }

  searchGuest(text: string): Observable<SearchGuestResponse> {
    return this.get(`/api/v1/search/guest?key=${text}`);
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
    return this.get(`/api/v1/members/export/${config.queryObj}`, {
      responseType: 'blob',
    });
  }

  getFeedback(entityId): Observable<FeedbackConfigI> {
    return this.get(`/api/v1/cms/feedback-form`);
  }

  getAllGuestStats(config): Observable<any> {
    // return this.get(`/api/v1/members/stats/${config.queryObj}`);
    return this.get(`/api/v1/dashboard-stats/reservation/${config.queryObj}`);
  }

  getGuestDocsStats(config): Observable<any> {
    return this.get(`/api/v1/dashboard-stats/reservation/${config.queryObj}`);
  }

  getGuestPaymentStats(config): Observable<any> {
    return this.get(`/api/v1/dashboard-stats/reservation/${config.queryObj}`);
  }

  exportCSVStat(config): Observable<any> {
    return this.get(`/api/v1/members/stats/export/${config.queryObj}`, {
      responseType: 'blob',
    });
  }

  exportDocsCSV(
    config,
    payload: { guestId: string; reservationId: string }[]
  ): Observable<any> {
    return this.post(
      `/api/v1/dashboard-stats/reservation/export${config.queryObj}`,
      payload,
      { responseType: 'blob' }
    );
  }
}
