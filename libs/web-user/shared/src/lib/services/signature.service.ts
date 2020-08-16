import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileData } from '../data-models/file';
import { ReservationService } from './booking.service';

@Injectable({
  providedIn: 'root',
})
export class SignatureService extends ReservationService {
  convertTextToImage(data): Observable<FileData> {
    return this.apiService.post(
      `/api/v1/utilities/text-to-image-converter`,
      data
    );
  }
}
