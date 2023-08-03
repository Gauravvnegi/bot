import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/services/api.service';
import { Observable } from 'rxjs';
import { GuestType, SearchGuestResponse } from '../types/guest.type';
import { QueryConfig } from '@hospitality-bot/admin/shared';

@Injectable()
export class GuestTableService extends ApiService {
  getGuestList(config: QueryConfig): Observable<any> {
    return this.get(`/api/v1/members${config.params}`);
  }

  getGuestById(guestId: string): Observable<GuestType> {
    return this.get(`/api/v1/members/${guestId}`);
  }

  searchGuest(text: string): Observable<any> {
    return this.get(`/api/v1/search/members?key=${text}&type=GUEST`);
  }

  getReservationFeedback(reservationId: string): Observable<any> {
    return this.get(`/api/v1/reservation/${reservationId}/feedback`);
  }

  getReservationDetail(bookingId: string): Observable<any> {
    return this.get(`/api/v1/reservation/${bookingId}?raw=true`);
  }

  getGuestReservations(guestId: string): Observable<any> {
    return this.get(`/api/v1/members/${guestId}/reservations`);
  }

  getGuestReservationById(guestId: string, reservationId: string) {
    return this.get(`/api/v1/members/${guestId}/reservations/${reservationId}`);
  }

  addGuest(data, config?: QueryConfig): Observable<any> {
    return this.post(`/api/v1/members${config.params}`, data);
  }

  updateGuest(data, guestId: string, config?: QueryConfig): Observable<any> {
    return this.patch(`/api/v1/members/${guestId}`, data);
  }

  exportCSV(config): Observable<any> {
    return this.get(`/api/v1/members/export${config.params}`, {
      responseType: 'blob',
    });
  }

  getAllGuestStats(config): Observable<any> {
    return this.get(`/api/v1/members/stats${config.params}`);
  }

  exportCSVStat(config): Observable<any> {
    return this.get(`/api/v1/members/stats/export${config.params}`, {
      responseType: 'blob',
    });
  }
}
