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
      
      selectedAmenities.forEach(selectedAmenity => {
        this.updateAminities(this.paidService, selectedAmenity.packageCode, selectedAmenity.metaData);
      })
      return this;
    }

    updateAminities(paidAmenities, packageCode, metaData){
      this.paidService = new PaidServiceDetail()
        .checkForSelectedAmenity(paidAmenities, packageCode, metaData);
      return this.paidService;
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
    description: string;
  
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
        set({}, 'description', get(input, ['amenityDescription'])),
        set({}, 'metaData',{}),
        set({}, 'isSelected', false)
      );
      return this;
    }

    checkForSelectedAmenity(allAmenities, packageCode, metaData) {
      const index = allAmenities.findIndex( amenity => amenity.packageCode === packageCode)
      allAmenities[index].isSelected = true;
      allAmenities[index].metaData = metaData;
      return allAmenities;
    }
  }

  export class Amenity{
    id: string;
    metaData: Metadata;
  }

  export class Metadata{
    airportName: string;
    flightNumber: string;
    personCount: number;
    pickupTime: string;
    terminal: string;
  }
