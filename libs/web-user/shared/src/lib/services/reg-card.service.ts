import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { Observable } from 'rxjs';
import { FileData } from '../data-models/file';

@Injectable({
  providedIn: 'root',
})
export class RegCardService extends ApiService {
  getRegCard(reservationId): Observable<FileData> {
    return this.get(`/api/v1/reservation/${reservationId}/regcard`);
  }
}
