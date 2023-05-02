import { Injectable } from '@angular/core';
import { HotelDetails } from '../models/hotelConfig.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HotelDetailService {
  // siteId: string;
  hotelDetails: HotelDetails;
  siteId = new BehaviorSubject<string>('');

  initHotelDetails(data) {
    this.hotelDetails = new HotelDetails().deserialize(data);
  }

  setSiteId(siteId) {
    this.siteId.next(siteId);
    this.setLocalSiteId(siteId);
  }

  setLocalSiteId(currSiteId) {
    localStorage.setItem('siteId', currSiteId);
  }

  getLocalSiteId() {
    return localStorage.getItem('siteId');
  }
}
