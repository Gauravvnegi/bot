import { get, set } from 'lodash';
import { FieldSchema } from './fieldSchema.model';

export interface Deserializable {
    deserialize(reservation: any, selectedAmenities: any, arrivalTime:any): this;
}

export class PaidServiceDetailDS implements Deserializable {
    paidService: PaidServiceDetail[];
    selectedService: PaidServiceDetail[];
    arrivalTime: string;

    deserialize(input: any, selectedAmenities: any, arrivalTime:string) {
      this.paidService = new Array<PaidServiceDetail>();
      this.selectedService = new Array<PaidServiceDetail>();
      this.arrivalTime = arrivalTime;
      
      input.forEach(service => {
       let amenity = new PaidServiceDetail().deserialize(service);
       if(service.subPackages.length > 0){
        let subPackages = new Array<PaidServiceDetail>();
        service.subPackages.forEach(subPackage => {
         subPackages.push(new PaidServiceDetail().deserialize(subPackage));
        });
        amenity.subPackages = subPackages;
       }
       this.paidService.push(amenity);
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
    remark:string;
    active:boolean;
    hasChild:boolean;
    autoAccept:boolean;
    source:string;
    type:string;
    unit:string;
    category:string;
    subPackages:PaidServiceDetail[];
  
    deserialize(input: any) {
      Object.assign(
        this,
        set({}, 'id',get(input, ['id'])),
        set({}, 'rate',get(input, ['rate'])),
        set({}, 'currencyCode', get(input, ['currency'])),
        set({}, 'packageCode', get(input, ['packageCode'])),
        set({}, 'label', get(input, ['name'])),
        set({}, 'quantity', get(input, ['quantity'])||1),
        set({}, 'imgUrl', get(input, ['imageUrl'])),
        set({}, 'hotelId', get(input, ['hotelId'])),
        set({}, 'description', get(input, ['description'])),
        set({}, 'metaData',get(input, ['metaData'])),
        set({}, 'remarks',get(input, ['remarks'])),
        set({}, 'active',get(input, ['active'])),
        set({}, 'hasChild',get(input, ['hasChild'])),
        set({}, 'autoAccept',get(input, ['autoAccept'])),
        set({}, 'type',get(input, ['type'])),
        set({}, 'unit',get(input, ['unit'])),
        set({}, 'category',get(input, ['category'])),
        set({}, 'source',get(input, ['source'])),
        set({}, 'isSelected', false)
      );
      return this;
    }

    checkForSelectedAmenity(paidService, selectedService) {
     paidService.forEach((paidAmenity, index)=> {
       let isSelected = false;
       let metaData ='';
       selectedService.forEach(selectedAminity => {
          if(paidAmenity.subPackages.length > 0){
            paidAmenity.subPackages.forEach((subPackage, subPackageIndex) => {
              if(subPackage.packageCode === selectedAminity.packageCode){
                  isSelected = true;
                  paidAmenity.subPackages[subPackageIndex].isSelected = true;
                  paidAmenity.subPackages[subPackageIndex].quantity = selectedAminity.quantity;
                  paidAmenity.subPackages[subPackageIndex].metaData = selectedAminity.metaData;
              }
            });
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
    remark:number;
    metaData: Metadata;
  }

  export class Metadata{
    airportName: string;
    flightNumber: string;
    pickupTime: string;
    terminal: string;
  }

  export interface SubPackageDetailsConfigI {
    amenity: FieldSchema;
  }
  
