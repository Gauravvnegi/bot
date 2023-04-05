import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/services/api.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConfigService extends ApiService {
  $config = new BehaviorSubject<Record<string, any>>({
    currencyConfiguration: [
      {
        key: 'INR',
        value: 'INR',
        icon:
          'https://nyc3.digitaloceanspaces.com/botfiles/bot/hotel/rupee/logos/black/static-content/rupee.png',
      },
    ],
    packageVisibility: [
      {
        key: 'preArrival',
        value: 'Pre-arrival',
      },
      {
        key: 'checkIn',
        value: 'Check-in',
      },
      {
        key: 'checkOut',
        value: 'Check-out',
      },
    ],
    roomDiscountConfig: [
      {
        key: 'Percentage',
        value: 'PERCENTAGE',
      },
      {
        key: 'Number',
        value: 'NUMBER',
      },
    ],
  });

  getColorAndIconConfig(hotelId: string): Observable<any> {
    return this.get(`/api/v1/cms/hotel/${hotelId}/configuration`);
  }

  getCountryCode(): Observable<any> {
    return this.get('/api/v1/config?key=COUNTRYCODE');
  }
}
