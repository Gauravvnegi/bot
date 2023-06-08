import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class OutletTableService extends ApiService {
  getOutletList(
    hotelId,
    config = { params: '?order=DESC&limit=5' }
  ): Observable<any> {
    return this.get(
      `/api/v1/entity/${hotelId}/tax${config?.params ?? ''}`
    ).pipe(
      map((res) => {
        return res;
      })
    );
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
