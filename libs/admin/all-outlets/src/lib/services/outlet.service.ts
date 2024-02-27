import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { TabValue } from '../constants/data-table';
import { ApiService } from '@hospitality-bot/shared/utils';
import { QueryConfig } from '@hospitality-bot/admin/library';
import { OutletConfig } from '../types/config';
import {
  FoodPackageListResponse,
  FoodPackageResponse,
  OutletResponse,
} from '../types/response';
import { SearchResultResponse } from 'libs/admin/library/src/lib/types/response';
import { MenuFormData, MenuItemCategory, MenuResponse } from '../types/menu';
import {
  FoodPackageForm,
  MenuItemForm,
  MenuItemListResponse,
  MenuItemResponse,
  MenuListResponse,
} from '../types/outlet';
import { PosReservationResponse } from 'libs/admin/outlets-dashboard/src/lib/types/reservation-table';

@Injectable()
export class OutletService extends ApiService {
  selectedTable = new BehaviorSubject<TabValue>(TabValue.ALL);

  getAllOutlets(entityId: string, config?: QueryConfig): Observable<any> {
    return this.get(
      `/api/v1/entity/${entityId}/library?type=SERVICE&serviceType=ALL&limit=5`
    );
  }

  exportCSV(entityId: string): Observable<any> {
    return this.get(`/api/v1/entity/${entityId}/outlet/export`, {
      responseType: 'blob',
    });
  }

  updateOutletItem(outletId, status): Observable<any> {
    return this.patch(`/api/v1/user/${outletId}/sites?status=${status}`, {});
  }

  getOutletConfig(
    config = { params: `?key=OUTLET_CONFIGURATION` }
  ): Observable<OutletConfig> {
    return this.get(`/api/v1/config${config.params ?? ''}`);
  }

  getMenuItems(
    config: QueryConfig,
    outletId: string
  ): Observable<MenuItemListResponse> {
    return this.get(`/api/v1/menus/items${config.params}`, {
      headers: { 'entity-id': outletId },
    });
  }

  getOutletById(outletId: string): Observable<OutletResponse> {
    return this.get(`/api/v1/entity/${outletId}?type=OUTLET`);
  }

  updateOutlet(outletId: string, data): Observable<OutletResponse> {
    return this.patch(`/api/v1/entity/${outletId}?type=OUTLET`, data);
  }

  addOutlet(data): Observable<OutletResponse> {
    return this.post(
      `/api/v1/entity/onboarding?source=CREATE_WITH&onboardingType=OUTLET`,
      data
    );
  }

  addMenuItems(
    data: MenuItemForm,
    menuId: string,
    outletId: string
  ): Observable<MenuItemResponse> {
    return this.post(`/api/v1/menus/items?menuId=${menuId}`, data, {
      headers: { 'entity-id': outletId },
    });
  }

  updateMenuItems(
    data: MenuItemForm,
    menuItemId: string,
    menuId: string
  ): Observable<any> {
    return this.patch(`/api/v1/menus/items/${menuItemId}`, data, {
      headers: { entityId: menuId },
    });
  }

  addMenu(data: MenuFormData, entityId: string): Observable<MenuResponse> {
    return this.post(`/api/v1/menus`, data, {
      headers: { 'entity-id': entityId },
    });
  }

  updateMenu(
    data: MenuFormData,
    menuId: string,
    entityId: string
  ): Observable<any> {
    return this.patch(`/api/v1/menus/${menuId}`, data, {
      headers: { 'entity-id': entityId },
    });
  }

  getMenu(menuId: string, entityId: string): Observable<MenuFormData> {
    return this.get(`/api/v1/menus/${menuId}`, {
      headers: { 'entity-id': entityId },
    });
  }

  getAllCategories(entityId: string, config: QueryConfig) {
    return this.get(`/api/v1/entity/${entityId}/categories${config.params}`);
  }

  createCategory(entityId: string, data: MenuItemCategory) {
    return this.post(`/api/v1/entity/${entityId}/categories`, data);
  }

  getMenuItemsById(menuItemId: string): Observable<any> {
    return this.get(`/api/v1/menus/items/${menuItemId}`);
  }

  addFoodPackage(
    outletId: string,
    data: FoodPackageForm
  ): Observable<FoodPackageResponse> {
    return this.post(`/api/v1/entity/${outletId}/library`, data, {
      headers: { entityId: outletId },
    });
  }

  updateFoodPackage(
    outletId: string,
    packageId,
    data,
    config?: QueryConfig
  ): Observable<any> {
    return this.patch(
      `/api/v1/entity/${outletId}/library/${packageId}${config?.params ?? ''}`,
      data
    );
  }

  getFoodPackageById(
    outletId: string,
    packageId: string,
    config?: QueryConfig
  ): Observable<any> {
    return this.get(
      `/api/v1/entity/${outletId}/library/${packageId}${config?.params ?? ''}`
    );
  }

  getServices(entityId: string, config?: QueryConfig): Observable<any> {
    return this.get(
      `/api/v1/entity/${entityId}/library${config?.params ?? ''}`,
      { headers: { 'entity-id': entityId } }
    );
  }

  getMenuList(entityId: string): Observable<MenuListResponse> {
    return this.get(`/api/v1/menus`, {
      headers: { 'entity-id': entityId },
    });
  }

  getFoodPackageList(
    entityId: string,
    config?: QueryConfig
  ): Observable<FoodPackageListResponse> {
    return this.get(
      `/api/v1/entity/${entityId}/library${config?.params ?? ''}`,
      { headers: { 'entity-id': entityId } }
    );
  }

  searchLibraryItem(
    entityId: string,
    config?: QueryConfig
  ): Observable<SearchResultResponse> {
    return this.get(
      `/api/v1/entity/${entityId}/library/search${config?.params ?? ''}`
    );
  }

  searchItem(
    entityId: string,
    config?: QueryConfig
  ): Observable<SearchResultResponse> {
    return this.get(
      `/api/v1/entity/${entityId}/menu/search${config?.params ?? ''}`
    );
  }

  getFoodPackageCategory(entityId: string): Observable<any> {
    return this.get(
      `/api/v1/entity/${entityId}/categories?type=FOOD_PACKAGE_CATEGORY`
    );
  }

  getReservationById(
    reservationId: string
  ): Observable<PosReservationResponse> {
    return this.get(`/api/v1/booking/${reservationId}?type=OUTLET`);
  }
}
