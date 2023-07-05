import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { Observable } from 'rxjs';

@Injectable()
export class OutletTableService extends ApiService {
  getOutletList(): Observable<any> {
    return this.get(`/api/v1/config?key=OUTLET_CONFIGURATION`);
  }

  exportCSV(hotelId, config): Observable<any> {
    return this.get(`/api/v1/outlets/export/${config.queryObj}`);
  }

  updateOutletItem(hotelId, outletId, status): Observable<any> {
    return this.patch(
      `/api/v1/user/${outletId}/sites/${hotelId}?status=${status}`,
      {}
    );
  }
}
