import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { MenuTabValue, TabValue } from '../constants/data-table';
import { ApiService } from '@hospitality-bot/shared/utils';
import { allOutletsResponse, menuListResponse } from '../constants/response';
import { map } from 'rxjs/operators';
import { QueryConfig } from '@hospitality-bot/admin/library';
import { MenuConfig, OutletConfig } from '../types/config';
import { OutletResponse } from '../types/response';

@Injectable()
export class OutletService extends ApiService {
  selectedTable = new BehaviorSubject<TabValue>(TabValue.ALL);
  selectedMenuTable = new BehaviorSubject<MenuTabValue>(MenuTabValue.BREAKFAST);
  menu: BehaviorSubject<MenuConfig> = new BehaviorSubject<MenuConfig>({
    type: [],
    mealPreference: [],
    category: [],
  });

  getAllOutlets(entityId: string, config?: QueryConfig): Observable<any> {
    return this.get(
      `/api/v1/entity/${entityId}/library?type=SERVICE&serviceType=ALL&limit=5`
    ).pipe(
      map((res) => {
        return allOutletsResponse;
      })
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

  getOutletConfig(): Observable<OutletConfig> {
    return this.get(`/api/v1/config?key=OUTLET_CONFIGURATION`).pipe(
      map((response: OutletConfig) => {
        response.type = response.type.map((item: any) => ({
          ...item,
          value: item.name.split(' ')[0].toUpperCase(),
        }));
        return response;
      })
    );
  }

  getMenuItems(): Observable<any> {
    return this.get(`/api/v1/config?key=OUTLET_CONFIGURATION`).pipe(
      map((res) => {
        return menuListResponse;
      })
    );
  }

  outletResponse: Partial<OutletResponse> = {
    id: '85692aa9-cf86-4f5d-8fe6-9783c9884e9b',
    name: 'test',
    type: 'RESTAURANT',
    contact: {
      countryCode: '+91',
      phoneNumber: '1234567890',
    },
    dayOfOperationStart: 'MONDAY',
    dayOfOperationEnd: 'SUNDAY',
    timeDayStart: '10:00',
    timeDayEnd: '22:00',
    address: {
      city: 'test',
      state: 'test',
      country: 'test',
      pinCode: 12333,
    },
  };

  //dummy
  getOutletById(outletId: string): Observable<any> {
    return this.get(
      `api/v1/entity/fb8c0b81-1062-43c1-a341-6677e8687c32/library/85692aa9-cf86-4f5d-8fe6-9783c9884e9b?type=SERVICE`
    ).pipe(
      map((res) => {
        return (res = this.outletResponse);
      })
    );
  }

  updateOutlet(outletId: string, data): Observable<any> {
    return this.patch(`/api/v1/entity/${outletId}`, data);
  }

  addOutlet(data): Observable<any> {
    const mockData = {
      id: '85692aa9-cf86-4f5d-8fe6-9783c9884e9b',
    };

    // Return an Observable of the mock data
    return of(mockData);
  }

  addMenuItems(data, config: QueryConfig): Observable<any> {
    return this.post(`/api/v1/menu-item ${config.params ?? ''}`, data);
  }

  /**
   * @function updateMenuItems
   * @description update menu items
   * @param data
   * @param itemId
   * @returns
   */
  updateMenuItems(itemId, data): Observable<any> {
    return this.patch(`/api/v1/menu-item /${itemId}`, data);
  }

  getMenuItemsById(itemId: string): Observable<any> {
    return this.get(`/api/v1/menu-item /${itemId}`);
  }

  addFoodPackage(data): Observable<any> {
    return this.post(`/api/v1/food-package`, data);
  }

  updateFoodPackage(packageId, data): Observable<any> {
    return this.patch(`/api/v1/food-package/${packageId}`, data);
  }

  getFoodPackageById(packageId: string): Observable<any> {
    return this.get(`/api/v1/food-package/${packageId}`);
  }
}
