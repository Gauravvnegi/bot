import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';

@Injectable()
export class StatisticsService extends ApiService {
  getDocumentStatistics(config) {
    return this.get(`/api/v1/guest-stats/document/${config.queryObj}`);
  }

  getVIPStatistics(config) {
    return this.get(`/api/v1/guest-stats/vip/${config.queryObj}`);
  }

  getPaymentStatistics(config) {
    return this.get(`/api/v1/guest-stats/payment/${config.queryObj}`);
  }
}