import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/services/api.service';
import { Observable } from 'rxjs';

@Injectable()
export class ThankYouService extends ApiService {
  explore(reservationId: string): Observable<any> {
    return this.get(`/api/v1/reservation/${reservationId}/explore`);
  }
}
