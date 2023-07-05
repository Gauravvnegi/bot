import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
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
    console.log(data, 'add-outlet');
    return this.patch(
      `/api/v1/entity/fb8c0b81-1062-43c1-a341-6677e8687c32/library/85692aa9-cf86-4f5d-8fe6-9783c9884e9b?type=SERVICE`,
      {
        id: '85692aa9-cf86-4f5d-8fe6-9783c9884e9b',
        name: 'test',
        rate: 0.0,
        startDate: 0,
        endDate: 0,
        active: true,
        packageCode: 'A0SC62RT',
        imageUrl:
          'https://botfiles.nyc3.cdn.digitaloceanspaces.com/bot/hotel/fb8c0b81-1062-43c1-a341-6677e8687c32/static-content/files/download_(1).jpeg',
        source: 'BOTSHOT',
        entityId: 'fb8c0b81-1062-43c1-a341-6677e8687c32',
        type: 'Complimentary',
        unit: 'Km',
        autoAccept: true,
        hasChild: false,
        parentId: 'c1a739bc-224b-11eb-adc1-0242ac120002',
        categoryName: 'Wifi',
        discountValue: 0.0,
        enableVisibility: ['CHECKIN'],
        discountedPrice: 0.0,
        created: 1688019650577,
        updated: 1688019650699,
        taxes: [],
      }
    );
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
