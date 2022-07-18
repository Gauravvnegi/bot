import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiService } from 'libs/shared/utils/src/lib/services/api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { RequestData } from '../../../../notification/src/lib/data-models/request.model';

@Injectable({ providedIn: 'root' })
export class RequestService extends ApiService {
  selectedRequest = new BehaviorSubject(null);
  refreshData = new BehaviorSubject(false);

  getReservationDetails(reservationId): Observable<any> {
    return this.get(`/api/v1/reservation/${reservationId}?raw=true`);
  }

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

  updatePreArrivalRequest(id, data) {
    return this.patch(`/api/v1/request/pre-arrival/${id}`, data);
  }

  getNotificationConfig(hotelId: string): Observable<any> {
    return this.get(`/api/v1/cms/hotel/${hotelId}/notification-config`);
  }

  getCMSServices(hotelId: string, config) {
    return this.get(`/api/v1/hotel/${hotelId}/cms-services${config.queryObj}`);
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

  createRequest(hotelId, data) {
    return this.post(
      `/api/v1/request?cmsUserType=Bot&hotelId=${hotelId}`,
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

  getGuestReservations(guestId: string): Observable<any> {
    return this.get(`/api/v1/guest/${guestId}/reservations`);
  }

  getGuestById(guestId: string): Observable<any> {
    return this.get(`/api/v1/guest/${guestId}`);
  }

  getGuestRequestData(guestId) {
    return this.get(`/api/v1/request/${guestId}/guest`);
  }
}
