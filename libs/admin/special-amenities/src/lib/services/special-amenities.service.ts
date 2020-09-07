import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../shared/utils/src/lib/api.service'

@Injectable()
export class SpecialAmenitiesService extends ApiService{

  getPackage(hotelId){
    return this.get(`/api/v1/hotel/${hotelId}/package/pms`);
  }
}
