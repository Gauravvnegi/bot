import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../shared/utils/src/lib/api.service';
import { Observable } from 'rxjs';

@Injectable()

export class ReservationService extends ApiService {

  getReservationDetails(reservationId): Observable<any> {
    return this.get(`/api/v1/reservation/${reservationId}?raw=true`);
  }
  
}
