import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReservationService extends ApiService {
  getReservationDetails(config) {
    return this.get(`/api/v1/reservations/${config.queryObj}`);
  }

  exportCSV(config): Observable<any> {
    return this.get(`/api/v1/reservations/export/${config.queryObj}`, {
      responseType: 'blob',
    });
  }
}
