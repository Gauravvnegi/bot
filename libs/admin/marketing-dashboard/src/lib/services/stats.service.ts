import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { Observable } from 'rxjs';

@Injectable()
export class GraphService extends ApiService {
  rateGraphStats(hotelId: string, config): Observable<any> {
    return this.get(
      `/api/v1/entity/${hotelId}/marketing-dashboard/open-vs-click${config.queryObj}`
    );
  }

  subscriberGraphStats(hotelId: string, config): Observable<any> {
    return this.get(
      `/api/v1/entity/${hotelId}/marketing-dashboard/subscribers-vs-unsubscribers${config.queryObj}`
    );
  }
}
