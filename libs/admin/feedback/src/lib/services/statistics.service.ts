import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';

@Injectable()
export class StatisticsService extends ApiService {
  getOverallNPSStatistics(config) {
    return this.get(`/api/v1/feedback-stats/${config.queryObj}`);
  }

  getDepartmentsStatistics(config) {
    return this.get(`/api/v1/feedback-stats/departments/${config.queryObj}`);
  }

  getServicesStatistics(config) {
    return this.get(`/api/v1/feedback-stats/services/${config.queryObj}`);
  }

  getTouchpointStatistics(config) {
    return this.get(`/api/v1/feedback-stats/touchpoint/${config.queryObj}`);
  }
}
