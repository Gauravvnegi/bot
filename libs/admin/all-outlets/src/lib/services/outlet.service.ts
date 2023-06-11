import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MenuTabValue, TabValue } from '../constants/data-table';
import { extend } from 'lodash';
import { ApiService } from '@hospitality-bot/shared/utils';
import { allOutletsResponse } from '../constants/response';
import { map } from 'rxjs/operators';
import { QueryConfig } from '@hospitality-bot/admin/library';

@Injectable()
export class OutletService extends ApiService {
  selectedTable = new BehaviorSubject<TabValue>(TabValue.ALL);
  selectedMenuTable = new BehaviorSubject<MenuTabValue>(MenuTabValue.BREAKFAST);

  getAllOutlets(hotelId: string, config?: QueryConfig): Observable<any> {
    return this.get(
      `/api/v1/entity/${hotelId}/library?type=SERVICE&serviceType=ALL&limit=5`
    ).pipe(
      map((res) => {
        return allOutletsResponse;
      })
    );
  }

  exportCSV(hotelId: string): Observable<any> {
    return this.get(`/api/v1/entity/${hotelId}/outlet/export`, {
      responseType: 'blob',
    });
  }

  updateOutletItem(outletId, status): Observable<any> {
    return this.patch(`/api/v1/user/${outletId}/sites?status=${status}`, {});
  }
}
