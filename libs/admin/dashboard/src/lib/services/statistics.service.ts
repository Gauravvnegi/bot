import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';

@Injectable()
export class StatisticsService extends ApiService {
  getStatistics(config) {
    return this.get(`/api/v1/dashboard-stats/${config.queryObj}`);
  }

  getCustomerStatistics(config) {
    return this.get(`/api/v1/dashboard-stats/customer/${config.queryObj}`);
  }
}
