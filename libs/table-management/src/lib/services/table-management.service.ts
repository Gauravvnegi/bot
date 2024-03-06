import { Injectable } from '@angular/core';
import { QueryConfig } from '@hospitality-bot/admin/shared';
import { ApiService } from '@hospitality-bot/shared/utils';
import { BehaviorSubject, Observable } from 'rxjs';
import { AreaFormDataResponse } from '../types/edit-area.type';
import { TableFormDataResponse } from '../types/edit-table.type';
import {
  AreaListResponse,
  AreaResponse,
  TableListResponse,
  TableManagementDatableTabs,
} from '../types/table-datable.type';
import { EntityTabFilterConfig } from 'libs/admin/global-shared/src/lib/types/entity-tab.type';

@Injectable()
export class TableManagementService extends ApiService {
  selectedTab = new BehaviorSubject<TableManagementDatableTabs>(null);
  entityId: string;
  onGlobalFilterChange = new BehaviorSubject<EntityTabFilterConfig>(null);

  getTableById(
    entityId: string,
    areaId: string
  ): Observable<TableFormDataResponse> {
    return this.get(
      `/api/v1/entity/${entityId}/inventory/${areaId}?type=TABLE`,
      this.preDefinedHeaders
    );
  }
  createTable(entityId: string, data: {}): Observable<TableFormDataResponse> {
    return this.post(
      `/api/v1/entity/${entityId}/inventory?type=TABLE`,
      data,
      this.preDefinedHeaders
    );
  }

  updateTable(entityId: string, data: {}): Observable<TableFormDataResponse> {
    return this.put(
      `/api/v1/entity/${entityId}/inventory?type=TABLE`,
      data,
      this.preDefinedHeaders
    );
  }

  getAreaById(
    entityId: string,
    areaId: string
  ): Observable<AreaFormDataResponse> {
    return this.get(
      `/api/v1/entity/${entityId}/inventory/${areaId}?type=AREA&raw=true`,
      this.preDefinedHeaders
    );
  }

  createArea(entityId: string, data: {}): Observable<AreaFormDataResponse> {
    return this.post(
      `/api/v1/entity/${entityId}/inventory?type=AREA`,
      data,
      this.preDefinedHeaders
    );
  }

  updateArea(entityId: string, data: {}): Observable<AreaFormDataResponse> {
    return this.patch(
      `/api/v1/entity/${entityId}/inventory?type=AREA`,
      data,
      this.preDefinedHeaders
    );
  }

  getList<T extends TableListResponse | AreaListResponse>(
    entityId: string,
    config?: QueryConfig
  ): Observable<T> {
    return this.get(
      `/api/v1/entity/${entityId}/inventory${config?.params ?? ''}`,
      this.preDefinedHeaders
    );
  }

  /**
   * @function searchLibraryItem To search library item
   * @param config  Will have type and search query
   *
   */
  searchLibraryItem(
    entityId: string,
    config?: QueryConfig
  ): Observable<AreaResponse> {
    return this.get(
      `/api/v1/entity/${entityId}/library/search${config?.params ?? ''}`,
      {
        headers: { 'entity-id': entityId },
      }
    );
  }
}
