import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../shared/utils/src/lib/api.service'

@Injectable()
export class SpecialAmenitiesService extends ApiService{

  uploadAmenityImage(hotelId, packageCode, data){
    return this.put(`/api/v1/hotel/${hotelId}/package/${packageCode}/upload`, data);
  }

  getAmenityPackages(hotelId, offset, limit){
    return this.get(`/api/v1/hotel/${hotelId}/package?offset=${offset}&limit=${limit}`);
  }
}
