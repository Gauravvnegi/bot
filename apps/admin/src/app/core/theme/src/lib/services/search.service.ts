import { Injectable } from '@angular/core';

import { map } from 'lodash';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SearchService extends ApiService {
  cartItems = new BehaviorSubject({});
  cartItems$ = this.cartItems.asObservable();

  search(searchKey): Observable<any> {
    // if (searchKey.search) {
    //   let bookingData = { type: 'Booking' };
    //   bookingData['bookingId'] = '09335387-1fd6-484d-a5b5-91a7c823d2d0';
    //   this.cartItems.next([bookingData]);
    // } else {
    //   this.cartItems.next([]);
    // }
    //return this.get(`/api/v1/reservation/?search=${searchKey}`);
    return this.cartItems$;
  }
}
