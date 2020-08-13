import { ApiService } from '../../../../../shared/utils/src/lib/api.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { DateService } from 'libs/shared/utils/src/lib/date.service';
import {
  ReservationDetails,
  FileDetails,
} from '../data-models/reservationDetails';
import { environment } from '@hospitality-bot/web-user/environment';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private _reservationId: string;
  private _reservationData;

  constructor(protected apiService: ApiService) {
    this.apiService.baseUrl = environment.baseUrl;
  }

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
