import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../../../../../libs/shared/utils/src/lib/services/api.service';
import { map } from 'lodash';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SearchService extends ApiService {
  cartItems = new BehaviorSubject({});
  cartItems$ = this.cartItems.asObservable();

  search(searchKey, entityId): Observable<any> {
    if (searchKey) {
      return this.get(`/api/v1/search?key=${searchKey}&hotel_id=${entityId}`);
    } else {
      this.cartItems.next({
        reservations: [],
      });
      return this.cartItems$;
    }
  }
}
