import { FieldSchema } from './fieldSchema.model';
import { get, set } from 'lodash';

export interface Deserializable {
    deserialize(reservation: any, selectedAmenities: any): this;
}

export class PaidServiceDetailDS implements Deserializable {
    paidService: PaidServiceDetail[];
    selectedService: PaidServiceDetail[];

    deserialize(input: any, selectedAmenities: any) {
      this.paidService = new Array<PaidServiceDetail>();
      this.selectedService = new Array<PaidServiceDetail>();

      input.forEach(service => {
        this.paidService.push(new PaidServiceDetail().deserialize(service));
      });

      selectedAmenities.forEach(service => {
        this.selectedService.push(new PaidServiceDetail().deserialize(service));
      });
      
      this.paidService = this.updateAminities(this.paidService, this.selectedService);
      return this;
    }

    updateAminities( paidService, selectedService ){
      this.paidService = new PaidServiceDetail().checkForSelectedAmenity(paidService, selectedService);
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
    quantity: string;
    isSelected: boolean;
    metaData: any;
    description: string;
  
    deserialize(input: any) {
      Object.assign(
        this,
        set({}, 'id',get(input, ['id'])),
        set({}, 'rate',get(input, ['rate'])),
        set({}, 'currencyCode', get(input, ['currency'])),
        set({}, 'packageCode', get(input, ['packageCode'])),
        set({}, 'label', get(input, ['name'])),
        set({}, 'quantity', get(input, ['quantity'])),
        set({}, 'imgUrl', get(input, ['imageUrl'])),
        set({}, 'hotelId', get(input, ['hotelId'])),
        set({}, 'description', get(input, ['description'])),
        set({}, 'metaData',get(input, ['metaData'])),
        set({}, 'isSelected', false)
      );
      return this;
    }

    checkForSelectedAmenity(paidService, selectedService) {
     paidService.forEach((paidAmenity, index)=> {
       let isSelected = false;
       let metaData ='';
       selectedService.forEach(selectedAminity => {
         if(paidAmenity.packageCode === selectedAminity.packageCode){
            isSelected = true;
            metaData = selectedAminity.metaData;
          }
       });
       paidService[index].isSelected = isSelected;
       paidService[index].metaData = metaData;
     });
    return paidService;
    }
  }

  export class Amenity{
    packageId: string;
    quantity:number;
    rate: number;
    metaData: Metadata;
  }

  export class Metadata{
    airportName: string;
    flightNumber: string;
    pickupTime: string;
    terminal: string;
  }
