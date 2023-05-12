import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { Observable } from 'rxjs/internal/Observable';
import { CategoryData, QueryConfig } from '../types/library';
import {
  CategoriesResponse,
  CategoryResponse,
  SearchResultResponse,
} from '../types/response';

@Injectable()
export class LibraryService extends ApiService {
  createLibraryItem<T, K>(hotelId: string, data: T): Observable<K> {
    return this.post(`/api/v1/entity/${hotelId}/library`, data);
  }

  updateLibraryItem<T, K>(
    hotelId: string,
    libraryItemId: string,
    data: T,
    config?: QueryConfig
  ): Observable<K> {
    return this.patch(
      `/api/v1/entity/${hotelId}/library/${libraryItemId}${
        config?.params ?? ''
      }`,
      data
    );
  }

  createCategory(
    hotelId: string,
    data: CategoryData
  ): Observable<CategoryResponse> {
    return this.post(`/api/v1/entity/${hotelId}/categories`, data);
  }

  getLibraryItems<T>(hotelId: string, config?: QueryConfig): Observable<T> {
    return this.get(`/api/v1/entity/${hotelId}/library${config?.params ?? ''}`);
  }

  getLibraryItemById<T>(
    hotelId: string,
    libraryItemId: string,
    config?: QueryConfig
  ): Observable<T> {
    return this.get(
      `/api/v1/entity/${hotelId}/library/${libraryItemId}${
        config?.params ?? ''
      }`
    );
  }

  /**
   * @function getCategories To get all the category
   * @param config Has params with type value equal to either 'PACKAGE_CATEGORY' | 'SERVICE_CATEGORY'
   */
  getCategories(
    hotelId: string,
    config?: QueryConfig
  ): Observable<CategoriesResponse> {
    return this.get(
      `/api/v1/entity/${hotelId}/categories/${config?.params ?? ''}`
    );
  }

  /**
   * @function searchLibraryItem To search library item
   * @param config  Will have type and search query
   *
   */
  searchLibraryItem(
    hotelId: string,
    config?: QueryConfig
  ): Observable<SearchResultResponse> {
    return this.get(
      `/api/v1/entity/${hotelId}/library/search${config?.params ?? ''}`
    );
  }

  exportCSV(hotelId: string, config?: QueryConfig) {
    return this.get(
      `/api/v1/entity/${hotelId}/library/export${config?.params ?? ''}`,
      {
        responseType: 'blob',
      }
    );
  }
}
