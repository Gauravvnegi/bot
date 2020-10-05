import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../shared/utils/src/lib/api.service';
import { Observable } from 'rxjs';

@Injectable()

export class ReservationService extends ApiService {

  getReservationDetails(reservationId): Observable<any> {
    return this.get(`/api/v1/reservation/${reservationId}?raw=true`);
  }

  getCountryList() {
    return this.get(`/api/v1/countries`);
  }

  getDocumentsByNationality(hotelId, nationality) {
    return this.get(
      `/api/v1/hotel/${hotelId}/support-documents?nationality=${nationality}`
    );
  }

  uploadDocumentFile(reservationId, guestId, formData): Observable<any> {
    return this.uploadDocument(
      `/api/v1/reservation/${reservationId}/guest/${guestId}/documents/upload`,
      formData
    );
  }
  
}
