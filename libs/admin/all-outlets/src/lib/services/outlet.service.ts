import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MenuTableValue, TableValue } from '../constants/data-table';
import { extend } from 'lodash';
import { ApiService } from '@hospitality-bot/shared/utils';

@Injectable()
export class OutletService extends ApiService {
  selectedTable = new BehaviorSubject<TableValue>(TableValue.ALL);
  selectedMenuTable = new BehaviorSubject<MenuTableValue>(MenuTableValue.BREAKFAST);

  getAllOutlets(hotelId: string): Observable<any> {
    return this.get(`/api/v1/entity/${hotelId}/all-outlets`);
  }

  exportCSV(hotelId: string): Observable<any> {
    return this.get(`/api/v1/entity/${hotelId}/outlet/export`, {
      responseType: 'blob',
    });
  }

  updateOutletItem(outletId, status): Observable<any> {
    return this.patch(
      `/api/v1/user/${outletId}/sites?status=${status}`,
      {}
    );
  }
}
