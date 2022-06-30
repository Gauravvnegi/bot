import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/services/api.service';
import { Observable } from 'rxjs';
import { FileData } from '../data-models/file';

@Injectable()
export class RegCardService extends ApiService {
  getRegCard(reservationId): Observable<FileData> {
    return this.get(`/api/v1/reservation/${reservationId}/regcard`);
  }
}
