import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { Observable } from 'rxjs';
import { RequestData } from '../data-models/request.model';

@Injectable({ providedIn: 'root' })
export class RequestService extends ApiService {
  getAllRequests(config): Observable<any> {
    return this.get(`/api/v1/live-request/${config.queryObj}`);
  }

  exportCSV(config): Observable<any> {
    return this.get(`/api/v1/live-request/export/${config.queryObj}`, {
      responseType: 'blob',
    });
  }

  updateRequest(reservationId, config) {
    return this.post(
      `/api/v1/reservation/${reservationId}/verify-request`,
      config
    );
  }

  createRequestData(hotelId: string, data: RequestData): Observable<any> {
    return this.post(`/api/v1/hotel/${hotelId}/notifications`, data);
  }

  uploadAttachments(hotelId, formData): Observable<any> {
    return this.uploadDocumentPost(
      `/api/v1/uploads?folder_name=hotel/${hotelId}/notification`,
      formData
    );
  }

  validateRequestData(data) {
    let status = [];

    if (!data.is_email_channel && !data.is_social_channel) {
      status.push({
        validity: false,
        code: "",
        data: {
          message: 'Select a channel'
        },
      });
    } else if (data.is_social_channel && data.social_channels.length === 0) {
      status.push({
        validity: false,
        code: "",
        data: {
          message: 'Select Bot Channels'
        },
      });
    } else if (!data.messageType) {
      status.push({
        validity: false,
        code: "",
        data: {
          message: 'Select message type'
        },
      });
    } else if (data.is_email_channel && data.emailIds.length === 0) {
      status.push({
        validity: false,
        code: "",
        data: {
          message: 'Enter emailIds'
        },
      });
    }
    return status;
  }
}
