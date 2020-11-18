import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { FileDetails } from '../data-models/reservationDetails';

@Injectable()
export class HealthDetailsService extends ApiService {
  
  getHealthTemplate(formId): Observable<any> {
    return this.get(`/api/v1/cms/health-form/${formId}`);
  }

  getHealthData(reservationId, guestId) {
    return this.get(
      `/api/v1/reservation/${reservationId}/guest/${guestId}/health-declaration`
    );
  }

  updateHealthForm(reservationId, guestId, data) {
    return this.put(
      `/api/v1/reservation/${reservationId}/guest/${guestId}/health-declaration`,
      data
    );
  }

  uploadSignature(reservationId, guestId, formData): Observable<FileDetails> {
    return this.uploadDocument(
      `/api/v1/reservation/${reservationId}/guest/${guestId}/health-declaration/signature`,
      formData
    );
  }
}
