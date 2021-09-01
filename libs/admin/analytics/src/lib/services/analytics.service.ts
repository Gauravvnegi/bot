import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { Observable } from 'rxjs';

@Injectable()
export class AnalyticsService extends ApiService {
  getConversationStats(hotelId: string): Observable<any> {
    return this.get(`/api/v1/hotel/${hotelId}/conversations/stats/counts`);
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

  getInhouseSourceStats(config) {
    return this.get(
      `/api/v1/live-request/inhouse/source-stats/count${config.queryObj}`
    );
  }

  getInhouseSentimentsStats(config) {
    return this.get(
      `/api/v1/live-request/inhouse/sentiment-stats/count${config.queryObj}`
    );
  }

  getInhouseRequest(config) {
    return this.get(`/api/v1/live-request/inhouse${config.queryObj}`);
  }

  exportInhouseRequestCSV(config) {
    return this.get(`/api/v1/live-request/inhouse/export${config.queryObj}`, {
      responseType: 'blob',
    });
  }
}
