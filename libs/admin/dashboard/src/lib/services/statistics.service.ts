import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { Observable } from 'rxjs';

@Injectable()
export class StatisticsService extends ApiService {
  getStatistics(config): Observable<any> {
    return this.get(`/api/v1/dashboard-stats/${config.queryObj}`);
  }

  getCustomerStatistics(config): Observable<any> {
    return this.get(`/api/v1/dashboard-stats/customer/${config.queryObj}`);
  }

  getBookingStatusStatistics(config): Observable<any> {
    return this.get(
      `/api/v1/dashboard-stats/reservations/status/${config.queryObj}`
    );
  }

  getReservationStatistics(config): Observable<any> {
    return this.get(`/api/v1/dashboard-stats/reservations/${config.queryObj}`);
  }

  getConversationStats(hotelId: string): Observable<any> {
    return this.get(`/api/v1/hotel/${hotelId}/conversations/stats/counts`);
  }
}
