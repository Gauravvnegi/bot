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

  createRequestData(hotelId: string, data): Observable<any> {
    return this.post(`/api/v1/hotel/${hotelId}/notifications`, data);
  }

  uploadAttachments(hotelId, formData): Observable<any> {
    return this.uploadDocumentPost(
      `/api/v1/uploads?folder_name=hotel/${hotelId}/notification`,
      formData
    );
  }

  getTemplate(hotelId: string, templateId: string, config): Observable<any> {
    return this.get(
      `/api/v1/hotel/${hotelId}/templates/${templateId}${config.queryObj}`
    );
  }

  getNotificationConfig(hotelId: string): Observable<any> {
    return this.get(`/api/v1/cms/hotel/${hotelId}/notification-config`);
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
