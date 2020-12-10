import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { FileDetails } from '../data-models/reservationDetails';
import { FormGroup } from '@angular/forms';

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

  validateHealthDecForm(healthDecForm: FormGroup) {
    let healthDecFG = healthDecForm.get('healthDeclarationForm') as FormGroup;
    let status = [];
    if (healthDecFG.invalid) {
      if (healthDecFG.get('primary').invalid) {
        status.push({
          validity: false,
          code: 'INVALID_FORM',
          msg: 'Invalid form. Please fill all the fields.',
          data: {
            index: 0,
          },
        });
      }
    }
    return status;
  }
}
