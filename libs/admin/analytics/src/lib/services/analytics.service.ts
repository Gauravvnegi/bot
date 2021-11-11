import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { Observable } from 'rxjs';

@Injectable()
export class AnalyticsService extends ApiService {
  getConversationStats(hotelId: string): Observable<any> {
    return this.get(`/api/v1/hotel/${hotelId}/conversations/stats/counts`);
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
    return this.get(
      `/api/v1/live-request/source-stats/count${config.queryObj}`
    );
  }

  getSentimentsStats(config) {
    return this.get(
      `/api/v1/live-request/sentiment-stats/count${config.queryObj}`
    );
  }

  getInhouseRequest(config) {
    return this.get(`/api/v1/live-request/list${config.queryObj}`);
  }

  exportInhouseRequestCSV(config) {
    return this.get(`/api/v1/live-request/list/export${config.queryObj}`, {
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
}
