import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { SelectedEntity } from 'libs/admin/manage-reservation/src/lib/types/reservation.type';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class OutletTableService extends ApiService {
  public selectedEntity = new BehaviorSubject<SelectedEntity>(null);

  getDineInReservations(entityId): Observable<any> {
    return this.get(`/api/v1/entity/${entityId}/inventory?type=ROOM_TYPE`).pipe(
      map((res) => {
        return {
          entityTypeCounts: {
            ALL: 50,
            GARDEN: 10,
            BAR: 20,
            TERACCE: 20,
          },
          entityStateCounts: {
            CONFIRMED: 4,
            CANCELED: 3,
            COMPLETED: 2,
            PREPARING: 2,
            BLANK_TABLE: 4,
            PAID: 1,
            RUNNING_KOT_TABLE: 4,
            RUNNING_TABLE: 3,
            PRINTED_TABLE: 7,
          },
          records: [],
        };
      })
    );
  }

  getDeliveryReservations(entityId): Observable<any> {
    return this.get(`/api/v1/entity/${entityId}/inventory?type=ROOM_TYPE`).pipe(
      map((res) => {
        return {
          entityTypeCounts: {
            ALL: 57,
            DINE_IN: 10,
            PICKUP: 20,
            DELIVERY: 20,
            ONLINE_ORDERS: 2,
            ADVANCE_ORDER: 5,
          },
          entityStateCounts: {
            CONFIRMED: 4,
            CANCELED: 3,
            COMPLETED: 2,
            PREPARING: 2,
            BLANK_TABLE: 4,
            PAID: 1,
            RUNNING_KOT_TABLE: 4,
            RUNNING_TABLE: 3,
            PRINTED_TABLE: 7,
          },
          records: [],
        };
      })
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
