import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { map } from 'lodash';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SearchService extends ApiService {
  cartItems = new BehaviorSubject({});
  cartItems$ = this.cartItems.asObservable();
  search(searchKey): Observable<any> {
    // return this.get(`/api/v1/reservation/?search=${searchKey}`);
    let data = { type: 'booking' };
    data['bookingId'] = '09335387-1fd6-484d-a5b5-91a7c823d2d0';
    this.cartItems.next(data);
    return this.cartItems$;
  }
}
