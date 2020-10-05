import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';

@Injectable({ providedIn: 'root' })
export class ReservationService extends ApiService {
  getReservationDetails(config) {
    return this.get(`/api/v1/reservations/${config.queryObj}`);
  }
}
