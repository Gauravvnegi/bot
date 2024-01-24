import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { kotData } from '../constants/datatable';
import { MenuOrderResponse } from 'libs/admin/outlets-dashboard/src/lib/types/form';

@Injectable({
  providedIn: 'root',
})
export class KotService extends ApiService {
  entityId: string;

  getKotItems(entityId: string): Observable<MenuOrderResponse> {
    return this.get(`/api/v1/entity/${entityId}/inventory?type=ROOM_TYPE`).pipe(
      map((res) => {
        return kotData;
      })
    );
  }
}
