import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../shared/utils/src/lib/api.service'
import { Amenity } from '../data-models/packageCnfig.model';

@Injectable()
export class SpecialAmenitiesService extends ApiService{

  uploadAmenityImage(hotelId, packageCode, data){
    return this.put(`/api/v1/hotel/${hotelId}/package/${packageCode}/upload`, data);
  }

  getAmenityPackages(hotelId, offset, limit){
    return this.get(`/api/v1/hotel/${hotelId}/package?offset=${offset}&limit=${limit}`);
  }

  getPackageDetails(hotelId, packageId){
    return this.get(`/api/v1/hotel/${hotelId}/package/${packageId}`);
  }

  updateAmenity(hotelId, data){
    return this.put(`/api/v1/hotel/${hotelId}/package`, data);
  }

  mapAmenityData(formValue, hotelId, id){
    const amenityData = new Amenity();
    amenityData.active = formValue.status;
    amenityData.hotelId = hotelId;
    amenityData.imgUrl = formValue.imageUrl;
    amenityData.packageCode = formValue.packageCode;
    amenityData.id = id;
    amenityData.amenityName = formValue.name;
    return amenityData;
  }
}
