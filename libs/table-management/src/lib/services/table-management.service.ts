import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { Observable } from 'rxjs';

@Injectable()
export class TableManagementService extends ApiService {
  getTableById(entityId: string, areaId: string): Observable<any> {
    return this.get(`api/v1/entity/${entityId}/inventory/${areaId}?type=TABLE`);
  }
  createTable(entityId: string, data: {}): Observable<any> {
    return this.patch(`/api/v1/entity/${entityId}/inventory?type=TABLE`, data);
  }

  updateTable(entityId: string, data: {}): Observable<any> {
    return this.patch(`/api/v1/entity/${entityId}/inventory?type=TABLE`, data);
  }

  getAreaById(entityId: string, areaId: string): Observable<any> {
    return this.get(`api/v1/entity/${entityId}/inventory/${areaId}?type=AREA`);
  }

  createArea(entityId: string, data: {}): Observable<any> {
    return this.post(`/api/v1/entity/${entityId}/inventory?type=AREA`, data);
  }

  updateArea(entityId: string, data: {}): Observable<any> {
    return this.patch(`/api/v1/entity/${entityId}/inventory?type=AREA`, data);
  }
}
