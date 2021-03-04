import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { Observable } from 'rxjs';

@Injectable()
export class SubscriptionService extends ApiService {

  getSubscriptionPlan(hotelId: string): Observable<any> {
    return this.get(`/api/v1/hotel/${hotelId}/subscriptions/current-plan`);
  }
}
