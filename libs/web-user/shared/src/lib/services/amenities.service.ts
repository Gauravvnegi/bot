import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/services/api.service';
import { AmenitiesDetailDS } from '../data-models/amenitiesConfig.model';

@Injectable()
export class AmenitiesService extends ApiService {
  private _amenitiesDetailDS: AmenitiesDetailDS;

  initAmenitiesDetailDS(amenities, arrivalTime) {
    this._amenitiesDetailDS = new AmenitiesDetailDS().deserialize(
      amenities,
      arrivalTime
    );
  }

  getHotelAmenities(reservationId) {
    return this.get(`/api/v1/hotel/${reservationId}/packages`);
  }

  get amenities() {
    return this._amenitiesDetailDS;
  }
}
