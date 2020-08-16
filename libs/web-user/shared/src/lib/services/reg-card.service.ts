import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileData } from '../data-models/file';
import { ReservationService } from './booking.service';

@Injectable({
  providedIn: 'root',
})
export class RegCardService extends ReservationService {
  getRegCard(reservationId): Observable<FileData> {
    return this.apiService.get(`/api/v1/reservation/${reservationId}/regcard`);
  }
}
