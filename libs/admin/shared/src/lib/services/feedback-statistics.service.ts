import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { Observable } from 'rxjs';

@Injectable()
export class StatisticsService extends ApiService {
  outletIds = [];
  getOverallNPSStatistics(config): Observable<any> {
    return this.get(`/api/v1/feedback-stats/${config.queryObj}`);
  }

  getDepartmentsStatistics(config): Observable<any> {
    return this.get(`/api/v1/feedback-stats/departments/${config.queryObj}`);
  }

  getServicesStatistics(config): Observable<any> {
    return this.get(`/api/v1/feedback-stats/services/${config.queryObj}`);
  }

  getTouchpointStatistics(config): Observable<any> {
    return this.get(`/api/v1/feedback-stats/touchpoints/${config.queryObj}`);
  }

  exportOverallNPSCSV(config): Observable<any> {
    return this.get(`/api/v1/feedback-stats/nps/export/${config.queryObj}`, {
      responseType: 'blob',
    });
  }

  exportOverallDepartmentsCSV(config): Observable<any> {
    return this.get(
      `/api/v1/feedback-stats/departments/export/${config.queryObj}`,
      {
        responseType: 'blob',
      }
    );
  }

  exportOverallServicesCSV(config): Observable<any> {
    return this.get(
      `/api/v1/feedback-stats/services/export/${config.queryObj}`,
      {
        responseType: 'blob',
      }
    );
  }

  exportOverallTouchpointsCSV(config): Observable<any> {
    return this.get(
      `/api/v1/feedback-stats/touchpoints/export/${config.queryObj}`,
      {
        responseType: 'blob',
      }
    );
  }

  feedbackDistribution(config): Observable<any> {
    return this.get(`/api/v1/feedback-stats/distribution/${config.queryObj}`);
  }

  getGlobalNPS(config): Observable<any> {
    return this.get(`/api/v1/feedback-stats/nps/${config.queryObj}`);
  }

  getNPSPerformance(config): Observable<any> {
    return this.get(
      `/api/v1/feedback-stats/nps/performance/${config.queryObj}`
    );
  }

  getSharedStats(config): Observable<any> {
    return this.get(`/api/v1/feedback-stats/shared${config.queryObj}`);
  }

  getPOSStats(config): Observable<any> {
    return this.get(`/api/v1/feedback-stats/npos${config.queryObj}`);
  }

  getBifurcationStats(config): Observable<any> {
    return this.get(`/api/v1/feedback-stats/bifurcations${config.queryObj}`);
  }
}
