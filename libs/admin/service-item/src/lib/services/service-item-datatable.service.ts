import { Injectable } from '@angular/core';
import { QueryConfig } from '@hospitality-bot/admin/shared';
import { ApiService } from '@hospitality-bot/shared/utils';
import { Observable } from 'rxjs';
import { ServiceItemListResponse } from '../types/service-item-datatable.type';
import { CategoryListResponse } from '../types/service-items-category-datable.type';

@Injectable()
export class ServiceItemService extends ApiService {
  createServiceItem(entityId: string, data): Observable<any> {
    return this.post(`/api/v1/entity/${entityId}/cms-service`, data);
  }

  getServiceItemById(entityId: string, serviceItemId: string): Observable<any> {
    return this.get(`/api/v1/entity/${entityId}/cms-service/${serviceItemId}`);
  }

  updateLibraryItem(
    entityId: string,
    serviceItemId: string,
    data
  ): Observable<any> {
    return this.put(``, data);
  }

  getServiceItemList(
    entityId: string,
    config: QueryConfig
  ): Observable<ServiceItemListResponse> {
    return this.get(
      `/api/v1/entity/${entityId}/cms-service-items${config.params}`
    );
  }

  updateServiceItemStatus(
    entityId: string,
    serviceItemId: string,
    config: { status: boolean }
  ): Observable<any> {
    return this.patch(
      `/api/v1/entity/${entityId}/cms-service/${serviceItemId}?status=${config.status}`,
      config
    );
  }

  updateCategoryStatus(
    entityId: string,
    categoryId: string,
    config: { status: boolean }
  ): Observable<any> {
    return this.patch(
      `/api/v1/entity/${entityId}/complaint/category/${categoryId}?status=${config.status}`,
      config
    );
  }

  getCategoryList(
    entityId: string,
    config: QueryConfig
  ): Observable<CategoryListResponse> {
    return this.get(
      `/api/v1/entity/${entityId}/complaint/category${config?.params}`
    );
  }

  createCategory(entityId: string, data: {}): Observable<any> {
    return this.post(`/api/v1/entity/${entityId}/complaint/category`, data);
  }

  updateCategory(entityId: string, categoryId: string, data): Observable<any> {
    return this.put(
      `/api/v1/entity/${entityId}/complaint/category/${categoryId}`,
      data
    );
  }

  getCategoryById(entityId: string, categoryId: string): Observable<any> {
    return this.get(
      `/api/v1/entity/${entityId}/complaint/category/${categoryId}`
    );
  }
}
