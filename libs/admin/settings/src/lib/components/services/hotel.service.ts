import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class HotelService extends ApiService {
  data = [
    {
      id: 1,
      name: 'Hotel 1',
      segment: '3 Star',
      address: 'Gurgaon',
      email: 'leela@gmail.com',
      contact: '1234567890',
      status: 'Active',
    },
    {
      id: 2,
      name: 'leela',
      segment: '3 Star',
      address: 'Gurgaon',
      email: 'leela@gmail.com',
      contact: '1234567890',
      status: 'Active',
    },
    {
      id: 3,
      name: 'Hotel 3',
      segment: '3 Star',
      address: 'Gurgaon',
      email: 'leela@gmail.com',
      contact: '1234567890',
      status: 'Active',
    },
    {
      id: 4,
      name: 'Hotel 4',
      segment: '3 Star',
      address: 'Gurgaon',
      email: 'leela@gmail.com',
      contact: '1234567890',
      status: 'Active',
    },
  ];
  getHotelList(
    entityId,
    config = { params: '?order=DESC&limit=5' }
  ): Observable<any> {
    return this.get(
      `/api/v1/entity/${entityId}/tax${config?.params ?? ''}`
    ).pipe(
      map((res) => {
        res.records = this.data;

        return res;
      })
    );
  }
  updateHotel(
    entityId,
    itemId = 'e44793eb-38b9-4944-a50d-b9fce62a4033',
    data
  ): Observable<any> {
    return this.patch(`/api/v1/entity/${entityId}/tax/${itemId}`, {
      status: false,
    });
  }

  getSegments(entityId): Observable<any> {
    return this.get(`/api/v1/config`, { params: { key: 'THEME_TYPE' } });
  }

  getServices(entityId: string, config?): Observable<any> {
    return this.get(`/api/v1/entity/${entityId}/library${config?.params ?? ''}`);
  }

  createHotel(entityId: string, data: any): Observable<any> {
    return this.post(
      `/api/v1/entity/onboarding?source=CREATE_WITH&onboardingType=HOTEL`,
      data
    );
  }
}
