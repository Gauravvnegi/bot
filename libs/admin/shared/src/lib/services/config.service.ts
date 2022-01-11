import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConfigService extends ApiService {
  $config = new BehaviorSubject(null);

  getColorAndIconConfig(hotelId: string): Observable<any> {
    return this.get(`/api/v1/cms/hotel/${hotelId}/configuration`);
  }
}
