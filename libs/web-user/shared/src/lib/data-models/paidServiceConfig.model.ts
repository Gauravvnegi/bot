import { FieldSchema } from './fieldSchema.model';
import { get, set } from 'lodash';

export interface Deserializable {
    deserialize(reservation: any): this;
}

export class PaidServiceDetailDS implements Deserializable {
    paidService: PaidServiceDetail[];
  
    deserialize(input: any) {
      this.paidService = new Array<PaidServiceDetail>();

      input.forEach(service => {
         this.paidService.push(new PaidServiceDetail().deserialize(service));
      });
      return this;
    }
  }

export class PaidServiceDetail implements Deserializable {
    id: string;
    rate: string;
    currencyCode: string;
    packageCode: string;
    imgUrl: string;
    amenityName: string;
    hotelId: string;
    metaData: any;
  
    deserialize(input: any) {
      Object.assign(
        this,set({}, 'id',get(input, ['id'])),
        set({}, 'rate',get(input, ['rate'])),
        set({}, 'currencyCode', get(input, ['currencyCode'])),
        set({}, 'packageCode', get(input, ['packageCode'])),
        set({}, 'amenityName', get(input, ['amenityName'])),
        set({}, 'imgUrl', get(input, ['imgUrl'])),
        set({}, 'hotelId', get(input, ['hotelId'])),
        set({}, 'metaData', get(input, ['metaData']))
      );
      return this;
    }
  }
