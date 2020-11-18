import { Injectable } from '@angular/core';
import { HotelDetails } from '../models/hotelConfig.model';

@Injectable({ providedIn: 'root' })
export class HotelDetailService {
  hotelDetails;

  initHotelDetails(data) {
    this.hotelDetails = new HotelDetails().deserialize(data);
  }
}
