import { EventEmitter, Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/services/api.service';
import { Observable } from 'rxjs';
import { SentimentStatsResponse } from '../types/response.types';
import { QueryConfig } from '@hospitality-bot/admin/shared';

@Injectable()
export class AnalyticsService extends ApiService {

  refreshStats: EventEmitter<any> = new EventEmitter();
  
  getConversationStats(config): Observable<any> {
    return this.get(`/api/v1/conversations-stats/counts${config.queryObj}`);
  }

  getConversationMessageStats(config) {
    return this.get(
      `/api/v1/conversations-stats/message/counts${config.queryObj}`
    );
  }

  getConversationTemplateStats(config) {
    return this.get(
      `/api/v1/conversations-stats/template/counts${config.queryObj}`
    );
  }

  getSentReceivedStat(entityId: string): Observable<any> {
    return this.get(`/api/v1/conversations-stats/graph`);
  }

  exportCSV(entityId, config): Observable<any> {
    return this.get(`/api/v1/conversations-stats/export${config.queryObj}`, {
      responseType: 'blob',
    });
  }

  getSourceStats(config) {
    return this.get(
      `/api/v1/request-analytics/source-stats/count${config.queryObj}`
    );
  }

  getSentimentsStats(config): Observable<SentimentStatsResponse> {
    return this.get(
      `/api/v1/request-analytics/sentiment-stats/count${config.queryObj}`
    );
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

  getPackageList(entityId: string) {
    return this.get(`/api/v1/entity/${entityId}/packages`);
  }

  updatePreArrivalRequest(id, data) {
    return this.patch(`/api/v1/request/pre-arrival/${id}`, data);
  }

  getComplaintStats(config: QueryConfig) {
    return this.get(`/api/v1/request-analytics/stats/${config.params}`);
  }

  getPerDayRequestStats(config: QueryConfig) {
    return this.get(`/api/v1/request-analytics/average/count/${config.params}`);
  }

  getAgentDistributionStats() {
    return this.get(`/api/v1/request-analytics/distribution`);
  }
}
