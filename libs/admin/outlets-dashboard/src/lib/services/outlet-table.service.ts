import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { SelectedEntity } from 'libs/admin/manage-reservation/src/lib/types/reservation.type';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { dineInReservationResponse } from '../constants/data-table';

@Injectable()
export class OutletTableService extends ApiService {
  public selectedEntity = new BehaviorSubject<SelectedEntity>(null);

  getReservations(entityId): Observable<any> {
    return this.get(`/api/v1/entity/${entityId}/inventory?type=ROOM_TYPE`).pipe(
      map((res) => {
        return dineInReservationResponse;
      })
    );
  }

  getPaymentMethod(entityId: string) {
    return this.get(
      `/api/v1/payment/configurations/admin?entity_id=${entityId}&status=ACTIVE`
    );
  }

  exportCSV(entityId, config): Observable<any> {
    return this.get(`/api/v1/outlets/export/${config.queryObj}`);
  }

  updateOutletItem(entityId, outletId, status): Observable<any> {
    return this.patch(
      `/api/v1/user/${outletId}/sites/${entityId}?status=${status}`,
      {}
    );
  }
}
