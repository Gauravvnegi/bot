import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../../../../../libs/shared/utils/src/lib/api.service';
import { map } from 'lodash';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SearchService extends ApiService {
  cartItems = new BehaviorSubject({});
  cartItems$ = this.cartItems.asObservable();

  search(searchKey, hotelId): Observable<any> {
    // if (searchKey.search) {
    //   let bookingData = { type: 'Booking' };
    //   bookingData['bookingId'] = '09335387-1fd6-484d-a5b5-91a7c823d2d0';
    //   this.cartItems.next([bookingData]);
    // } else {
    //   this.cartItems.next([]);
    // }
    return this.get(`/api/v1/search?key=${searchKey}&hotel_id=${hotelId}`);
    
    return this.cartItems$;
  }
}
