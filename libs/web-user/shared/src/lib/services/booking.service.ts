import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { Observable } from 'rxjs/internal/Observable';
import { ReservationDetails } from '../data-models/reservationDetails';

@Injectable({ providedIn: 'root' })
export class ReservationService extends ApiService {
  private _reservationId: string;
  private _reservationData;

  getReservationDetails(reservationId): Observable<ReservationDetails> {
    return this.get(`/api/v1/reservation/${reservationId}?raw=true`);
  }

  checkIn(reservationId, data): Observable<any> {
    return this.post(`/api/v1/reservation/${reservationId}/checkin`, data);
  }

  get reservationId() {
    return this._reservationId;
  }

  set reservationId(reservationId) {
    this._reservationId = reservationId;
  }

  get reservationData() {
    return this._reservationData;
  }

  set reservationData(reservationData) {
    this._reservationData = reservationData;
  }
}
