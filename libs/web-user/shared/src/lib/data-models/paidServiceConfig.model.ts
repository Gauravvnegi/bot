import { FieldSchema } from './fieldSchema.model';
import { get, set } from 'lodash';

export interface Deserializable {
    deserialize(reservation: any, selectedAmenities: any): this;
}

export class PaidServiceDetailDS implements Deserializable {
    paidService: PaidServiceDetail[];
  
    deserialize(input: any, selectedAmenities: any) {
      this.paidService = new Array<PaidServiceDetail>();

      input.forEach(service => {
         this.paidService.push(new PaidServiceDetail().deserialize(service));
      });
      this.paidService = new PaidServiceDetail().checkForSelectedAmenity(this.paidService, selectedAmenities);
      return this;
    }
  }

export class PaidServiceDetail implements Deserializable {
    id: string;
    rate: string;
    currencyCode: string;
    packageCode: string;
    imgUrl: string;
    label: string;
    hotelId: string;
    isSelected: boolean;
    metaData: any;
  
    deserialize(input: any) {
      Object.assign(
        this,
        set({}, 'id',get(input, ['id'])),
        set({}, 'rate',get(input, ['rate'])),
        set({}, 'currencyCode', get(input, ['currencyCode'])),
        set({}, 'packageCode', get(input, ['packageCode'])),
        set({}, 'label', get(input, ['amenityName'])),
        set({}, 'imgUrl', get(input, ['imgUrl'])),
        set({}, 'hotelId', get(input, ['hotelId'])),
        set({}, 'metaData',{}),
        set({}, 'isSelected', false)
      );
      return this;
    }

    checkForSelectedAmenity(allAmenities,selectedAmenities){
      selectedAmenities.forEach(selectedAmenity => {
        const index = allAmenities.findIndex( amenity => amenity.id === selectedAmenity.specialAmenitiesId)
        allAmenities[index].isSelected = true;
        allAmenities[index].metaData = selectedAmenity.metaData;
      });
      return allAmenities;
    }
  }
