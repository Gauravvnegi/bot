import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/services/api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Option } from '../types/form.type';

@Injectable({ providedIn: 'root' })
export class ConfigService extends ApiService {
  public currency: Option[] = [{ label: 'INR', value: 'INR' }];
  $config = new BehaviorSubject<Record<string, any>>(null);
  $isDayBookingAvailable = new BehaviorSubject<boolean>(false);

  getColorAndIconConfig(
    entityId: string
  ): Observable<Record<ConfigurationValue, any>> {
    return this.get(`/api/v1/cms/entity/${entityId}/configuration`);
  }

  getCountryCode(): Observable<any> {
    return this.get('/api/v1/config?key=COUNTRYCODE');
  }

  getDayBookingConfiguration(entityId: string): Observable<any> {
    return this.get(
      `/api/v1/configurations/frontdesk?entity-id=${entityId}&configType=DAY_BOOKING`
    );
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
  | 'orderConfig'
  | '_id'
  | 'packageVisibility'
  | 'bookingConfig'
  | 'orderConfig';
