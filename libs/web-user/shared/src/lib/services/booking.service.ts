import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ApiService } from '../../../../../shared/utils/src/lib/api.service';
import { ReservationDetails } from '../data-models/reservationDetails';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private _reservationId: string;
  private _reservationData;

  constructor(protected apiService: ApiService) {}

  getReservationDetails(reservationId): Observable<ReservationDetails> {
    return this.apiService.get(`/api/v1/reservation/${reservationId}?raw=true`);
  }

  checkIn(reservationId, data): Observable<any> {
    return this.apiService.post(
      `/api/v1/reservation/${reservationId}/checkin`,
      data
    );
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
