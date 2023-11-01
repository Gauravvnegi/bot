import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiService } from 'libs/shared/utils/src/lib/services/api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { RequestData } from '../../../../notification/src/lib/data-models/request.model';
import { RequestStatus } from '../constants/request';
import { CMSUpdateJobData } from '../types/request.type';
import { AllJobRequestResponse } from '../types/response.types';

@Injectable({ providedIn: 'root' })
export class RequestService extends ApiService {
  selectedRequest = new BehaviorSubject(null);
  refreshData = new BehaviorSubject<boolean>(false);
  requestStatus = new BehaviorSubject<RequestStatus[]>([]); // ['TODO', 'RESOLVED', 'CANCELED', 'IN_PROGRESS', 'TIMEOUT']
  assigneeList = new BehaviorSubject<any[]>([]);
  refreshItemList = new BehaviorSubject<boolean>(false);
  requestListFilter = new BehaviorSubject<string>('');
  selectedRequestStatus = new BehaviorSubject<any>({});

  syncRequest(entityId: string): Observable<any> {
    return this.get(
      `/api/v1/request/entity/${entityId}/sync-cms?cmsUserType=admin`
    );
  }

  getReservationDetails(reservationId): Observable<any> {
    return this.get(`/api/v1/reservation/${reservationId}?raw=true`);
  }

  getAllRequests(config): Observable<any> {
    return this.get(`/api/v1/request/${config.queryObj}`);
  }

  getAllLiveRequest(config): Observable<AllJobRequestResponse> {
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

  createRequestData(entityId: string, data: RequestData): Observable<any> {
    return this.post(`/api/v1/entity/${entityId}/notifications`, data);
  }

  searchRequest(entityId: string, config) {
    return this.get(`/api/v1/request/${entityId}/search${config.queryObj}`);
  }

  uploadAttachments(entityId, formData): Observable<any> {
    return this.uploadDocumentPost(
      `/api/v1/uploads?folder_name=hotel/${entityId}/notification`,
      formData
    );
  }

  getTemplate(
    entityId: string,
    templateId: string,
    journey: string
  ): Observable<any> {
    return this.get(
      `/api/v1/entity/${entityId}/templates/${templateId}?journey=${journey}`
    );
  }

  updatePreArrivalRequest(id, data) {
    return this.patch(`/api/v1/request/pre-arrival/${id}`, data);
  }

  getNotificationConfig(entityId: string): Observable<any> {
    return this.get(`/api/v1/cms/entity/${entityId}/notification-config`);
  }

  getCMSServices(entityId: string, config) {
    return this.get(
      `/api/v1/entity/${entityId}/cms-services${config.queryObj}`
    );
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

  createRequest(entityId, data) {
    return this.post(
      `/api/v1/request?cmsUserType=admin&source=ADMIN&entityId=${entityId}`,
      data
    );
  }

  /**
   * Updates status of job to to-do or close
   */
  updateJobRequestStatus(config, data: CMSUpdateJobData) {
    return this.put(
      `/api/v1/reservation/cms-update-job-status${config.queryObj}`,
      data
    );
  }

  searchBooking(config) {
    return this.get(`/api/v1/reservation/room${config}`);
  }

  getGuestReservations(guestId: string): Observable<any> {
    return this.get(`/api/v1/members/${guestId}/reservations`);
  }

  getGuestById(guestId: string): Observable<any> {
    return this.get(`/api/v1/members/${guestId}`);
  }

  getGuestRequestData(guestId) {
    return this.get(`/api/v1/request/${guestId}/guest`);
  }

  getItemDetails(entityId: string, itemId: string): Observable<any> {
    return this.get(`/api/v1/entity/${entityId}/cms-service/${itemId}`);
  }

  assignComplaintToUser(jobId: string, data): Observable<any> {
    return this.patch(`/api/v1/request/${jobId}/assignee`, data);
  }

  addServiceItem(entityId: string, data): Observable<any> {
    return this.post(`/api/v1/entity/${entityId}/cms-service`, data);
  }

  getStatusList(jobId: string): Observable<any> {
    return this.get(`/api/v1/request/job/${jobId}`);
  }
}
