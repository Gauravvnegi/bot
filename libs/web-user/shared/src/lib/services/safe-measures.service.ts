import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Measures } from '../data-models/safeMeasureConfig.model';
import { ReservationService } from './booking.service';

@Injectable()
export class SafeMeasuresService extends ReservationService {
  getSafeMeasures(hotelId): Observable<Measures> {
    return this.apiService.get(`/api/v1/hotel/${hotelId}/covid-safe-measures`);
  }
}
