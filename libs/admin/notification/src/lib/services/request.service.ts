import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiService } from 'libs/shared/utils/src/lib/services/api.service';
import { Observable } from 'rxjs';
import { RequestData } from '../../../../notification/src/lib/data-models/request.model';

@Injectable({ providedIn: 'root' })
export class RequestService extends ApiService {
  getAllRequests(config): Observable<any> {
    return this.get(`/api/v1/request/${config.queryObj}`);
  }

  exportCSV(config): Observable<any> {
    return this.get(`/api/v1/request/export/${config.queryObj}`, {
      responseType: 'blob',
    });
  }

  updateRequest(reservationId, config) {
    return this.post(
      `/api/v1/reservation/${reservationId}/verify-request`,
      config
    );
  }

  createRequestData(entityId: string, data): Observable<any> {
    return this.post(`/api/v1/entity/${entityId}/notifications`, data);
  }

  uploadAttachments(entityId, formData): Observable<any> {
    return this.uploadDocumentPost(
      `/api/v1/uploads?folder_name=hotel/${entityId}/notification`,
      formData
    );
  }

  getTemplate(entityId: string, templateId: string, config): Observable<any> {
    return this.get(
      `/api/v1/entity/${entityId}/templates/${templateId}${config.queryObj}`
    );
  }

  getNotificationConfig(entityId: string): Observable<any> {
    return this.get(`/api/v1/cms/entity/${entityId}/notification-config`);
  }

  validateRequestData(fg: FormGroup, channelSelection) {
    const status = [];

    if (channelSelection) {
      status.push({
        validity: false,
        code: '',
        data: {
          message: 'Select atleast one channel',
        },
      });
    } else if (fg.invalid) {
      status.push({
        validity: false,
        code: '',
        data: {
          message: 'Invalid form',
        },
      });
    }
    return status;
  }
}
