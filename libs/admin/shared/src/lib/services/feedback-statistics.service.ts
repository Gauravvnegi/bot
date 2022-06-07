import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class StatisticsService extends ApiService {
  outletIds = [];
  type: string;
  $outletChange = new BehaviorSubject({ status: false, type: '' });
  markReadStatusChanged = new BehaviorSubject(false);
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

  getBifurcationStats(config): Observable<any> {
    return this.get(`/api/v1/feedback-stats/bifurcations${config.queryObj}`);
  }

  exportPOSCSV(config) {
    return this.get(`/api/v1/feedback-stats/npos/export${config.queryObj}`, {
      responseType: 'blob',
    });
  }

  getGTMAcrossServices(config) {
    // return this.get(`/api/v1/feedback-stats/guest-to-meet${config.queryObj}`);

    return this.get(`/api/v1/feedback/guests-card${config.queryObj}`);
  }
}
