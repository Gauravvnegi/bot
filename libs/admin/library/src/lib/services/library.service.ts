import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { tokensConfig } from 'libs/admin/shared/src/lib/constants/common';
import { Observable } from 'rxjs/internal/Observable';
import { CategoryData, QueryConfig } from '../types/library';
import {
  CategoriesResponse,
  CategoryResponse,
  SearchResultResponse
} from '../types/response';

@Injectable()
export class LibraryService extends ApiService {
  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({
      'hotel-id': localStorage.getItem(tokensConfig.entityId),
    }),
  };

  createLibraryItem<T, K>(entityId: string, data: T): Observable<K> {
    return this.post(`/api/v1/entity/${entityId}/library`, data);
  }

  updateLibraryItem<T, K>(
    entityId: string,
    libraryItemId: string,
    data: T,
    config?: QueryConfig
  ): Observable<K> {
    return this.patch(
      `/api/v1/entity/${entityId}/library/${libraryItemId}${
        config?.params ?? ''
      }`,
      data
    );
  }

  createCategory(
    entityId: string,
    data: CategoryData
  ): Observable<CategoryResponse> {
    return this.post(`/api/v1/entity/${entityId}/categories`, data);
  }

  getLibraryItems<T>(entityId: string, config?: QueryConfig): Observable<T> {
    return this.get(`/api/v1/entity/${entityId}/library${config?.params ?? ''}`);
  }

  getLibraryItemById<T>(
    entityId: string,
    libraryItemId: string,
    config?: QueryConfig
  ): Observable<T> {
    return this.get(
      `/api/v1/entity/${entityId}/library/${libraryItemId}${
        config?.params ?? ''
      }`
    );
  }

  /**
   * @function getCategories To get all the category
   * @param config Has params with type value equal to either 'PACKAGE_CATEGORY' | 'SERVICE_CATEGORY'
   */
  getCategories(
    entityId: string,
    config?: QueryConfig
  ): Observable<CategoriesResponse> {
    return this.get(
      `/api/v1/entity/${entityId}/categories/${config?.params ?? ''}`
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
  ): Observable<SearchResultResponse> {
    return this.get(
      `/api/v1/entity/${entityId}/library/search${config?.params ?? ''}`
    );
  }

  exportCSV(entityId: string, config?: QueryConfig) {
    return this.get(
      `/api/v1/entity/${entityId}/library/export${config?.params ?? ''}`,
      {
        responseType: 'blob',
      }
    );
  }
}
