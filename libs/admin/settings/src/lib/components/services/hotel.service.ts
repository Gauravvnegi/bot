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
    hotelId,
    config = { params: '?order=DESC&limit=5' }
  ): Observable<any> {
    return this.get(
      `/api/v1/entity/${hotelId}/tax${config?.params ?? ''}`
    ).pipe(
      map((res) => {
        res.records = this.data;

        return res;
      })
    );
  }
  updateHotel(
    hotelId,
    itemId = 'e44793eb-38b9-4944-a50d-b9fce62a4033',
    data
  ): Observable<any> {
    return this.patch(`/api/v1/entity/${hotelId}/tax/${itemId}`, {
      status: false,
    });
  }

  getSegments(hotelId): Observable<any> {
    return this.get(`/api/v1/config`, { params: { key: 'THEME_TYPE' } });
  }

  getServices(hotelId: string, config?): Observable<any> {
    return this.get(`/api/v1/entity/${hotelId}/library${config?.params ?? ''}`);
  }

  createHotel(hotelId: string, data: any): Observable<any> {
    return this.post(
      `/api/v2/entity/onboarding?source=CREATE_WITH&onboardingType=HOTEL`,
      data
    );
  }
}
