import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';

@Injectable()
export class AmenitiesService extends ApiService {

  getHotelAmenities(reservationId){
    return this.get(`/api/v1/hotel/${reservationId}/special-amenities`);
  }
}
