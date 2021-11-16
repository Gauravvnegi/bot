import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { RequestData } from '../../../../notification/src/lib/data-models/request.model';

@Injectable({ providedIn: 'root' })
export class RequestService extends ApiService {
  selectedRequest = new BehaviorSubject(null);
  refreshData = new BehaviorSubject(false);
  getAllRequests(config): Observable<any> {
    return this.get(`/api/v1/request/${config.queryObj}`);
  }

  getAllLiveRequest(config) {
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

  createRequestData(hotelId: string, data: RequestData): Observable<any> {
    return this.post(`/api/v1/hotel/${hotelId}/notifications`, data);
  }

  searchRequest(hotelId: string, config) {
    return this.get(`/api/v1/request/${hotelId}/search${config.queryObj}`);
  }

  uploadAttachments(hotelId, formData): Observable<any> {
    return this.uploadDocumentPost(
      `/api/v1/uploads?folder_name=hotel/${hotelId}/notification`,
      formData
    );
  }

  getTemplate(
    hotelId: string,
    templateId: string,
    journey: string
  ): Observable<any> {
    return this.get(
      `/api/v1/hotel/${hotelId}/templates/${templateId}?journey=${journey}`
    );
  }

  getNotificationConfig(hotelId: string): Observable<any> {
    return this.get(`/api/v1/cms/hotel/${hotelId}/notification-config`);
  }

  getCMSServices(hotelId: string) {
    return this.get(`/api/v1/hotel/${hotelId}/cms-services`);
  }

  validateRequestData(fg: FormGroup, channelSelection) {
    let status = [];

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

  createRequest(hotelId, data) {
    return this.post(
      `/api/v1/reservation/cms-create-job?cmsUserType=Bot&hotelId=${hotelId}`,
      data
    );
  }

  closeRequest(config, data) {
    return this.post(
      `/api/v1/reservation/cms-close-job${config.queryObj}`,
      data
    );
  }

  searchBooking(config) {
    return this.get(`/api/v1/reservation/room${config}`);
  }
}
