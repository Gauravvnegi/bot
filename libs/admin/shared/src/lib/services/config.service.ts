import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/services/api.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConfigService extends ApiService {
  $config = new BehaviorSubject<Record<string, any>>(null);

  getColorAndIconConfig(
    hotelId: string
  ): Observable<Record<ConfigurationValue, any>> {
    return this.get(`/api/v1/cms/entity/${hotelId}/configuration`);
  }

  getCountryCode(): Observable<any> {
    return this.get('/api/v1/config?key=COUNTRYCODE');
  }
}

type ConfigurationValue =
  | 'settingsConfig'
  | 'marketingDashboard'
  | 'currencyConfiguration'
  | 'responseRate'
  | 'hotel_id'
  | 'taskBreakdown'
  | 'paymentSetting'
  | 'requestModuleConfiguration'
  | 'flashNotifications'
  | 'roomDiscountConfig'
  | 'communicationChannels'
  | '_id'
  | 'packageVisibility'
  | 'bookingConfig';
