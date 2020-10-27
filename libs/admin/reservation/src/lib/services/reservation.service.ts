import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../shared/utils/src/lib/api.service';
import { Observable } from 'rxjs';

@Injectable()
export class ReservationService extends ApiService {
  getReservationDetails(reservationId): Observable<any> {
    return this.get(`/api/v1/reservation/${reservationId}?raw=true`);
  }

  getCountryList(): Observable<any> {
    return this.get(`/api/v1/countries`);
  }

  getDocumentsByNationality(hotelId, nationality): Observable<any> {
    return this.get(
      `/api/v1/hotel/${hotelId}/support-documents?nationality=${nationality}`
    );
  }

  updateStepStatus(reservationId, data): Observable<any> {
    return this.put(`/api/v1/reservation/${reservationId}/verify-steps`, data);
  }

  updateJourneyStatus(reservationId, data): Observable<any> {
    return this.put(
      `/api/v1/reservation/${reservationId}/verify-journey`,
      data
    );
  }

  downloadInvoice(reservationId): Observable<any> {
    return this.get(`/api/v1/reservation/${reservationId}/invoice`);
  }

  prepareInvoice(reservationId, data = {}): Observable<any> {
    return this.put(`/api/v1/reservation/${reservationId}/invoice`, data);
  }

  uploadDocumentFile(reservationId, guestId, formData): Observable<any> {
    return this.uploadDocument(
      `/api/v1/reservation/${reservationId}/guest/${guestId}/documents/upload`,
      formData
    );
  }

  generateJourneyLink(reservationId, journeyName): Observable<any> {
    return this.get(
      `/api/v1/reservation/${reservationId}/generate-link?journey=${journeyName}`
    );
  }

  checkCurrentWindow(reservationId): Observable<any> {
    return this.get(`/api/v1/reservation/${reservationId}/journey-window`);
  }

  getRequestsByReservationId(reservationId, config): Observable<any> {
    return this.get(`/api/v1/reservation/${reservationId}/live-request`);
  }
}
