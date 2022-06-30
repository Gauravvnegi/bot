import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/services/api.service';
import { Observable } from 'rxjs';

@Injectable()
export class AnalyticsService extends ApiService {
  getConversationStats(hotelId: string, config): Observable<any> {
    return this.get(
      `/api/v1/hotel/${hotelId}/conversations/stats/counts${config.queryObj}`
    );
  }

  getConversationMessageStats(hotelId: string, config) {
    return this.get(
      `/api/v1/hotel/${hotelId}/conversations/message/stats/counts${config.queryObj}`
    );
  }

  getConversationTemplateStats(hotelId: string, config) {
    return this.get(
      `/api/v1/hotel/${hotelId}/conversations/template/stats/counts${config.queryObj}`
    );
  }

  getSentReceivedStat(hotelId: string): Observable<any> {
    return this.get(`/api/v1/hotel/${hotelId}/conversations/stats/graph`);
  }

  exportCSV(hotelId, config): Observable<any> {
    return this.get(
      `/api/v1/hotel/${hotelId}/conversations/stats/export${config.queryObj}`,
      {
        responseType: 'blob',
      }
    );
  }

  getSourceStats(config) {
    return this.get(`/api/v1/request/source-stats/count${config.queryObj}`);
  }

  getSentimentsStats(config) {
    return this.get(`/api/v1/request/sentiment-stats/count${config.queryObj}`);
  }

  getInhouseRequest(config) {
    return this.get(`/api/v1/request${config.queryObj}`);
  }

  exportInhouseRequestCSV(config) {
    return this.get(`/api/v1/request/export${config.queryObj}`, {
      responseType: 'blob',
    });
  }

  closeRequest(config, data) {
    return this.post(
      `/api/v1/reservation/cms-close-job${config.queryObj}`,
      data
    );
  }

  getPackageList(hotelId: string) {
    return this.get(`/api/v1/hotel/${hotelId}/packages`);
  }

  updatePreArrivalRequest(id, data) {
    return this.patch(`/api/v1/request/pre-arrival/${id}`, data);
  }
}
