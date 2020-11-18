import { FieldSchema } from './fieldSchema.model';
import { get, set } from 'lodash';

export interface Deserializable {
    deserialize(reservation: any): this;
}

export class ComplimentaryServiceDetailDS implements Deserializable {
    complimentaryService: ComplimentaryServiceDetail[];
  
    deserialize(input: any) {
      this.complimentaryService = new Array<ComplimentaryServiceDetail>();

      input.forEach(service => {
         this.complimentaryService.push(new ComplimentaryServiceDetail().deserialize(service));
      });
      return this;
    }
  }

export class ComplimentaryServiceDetail implements Deserializable {
    id: string;
    rate: string;
    currencyCode: string;
    packageCode: string;
    imgUrl: string;
    amenityName: string;
    hotelId: string;
  
    deserialize(input: any) {
      Object.assign(
        this,set({}, 'id',get(input, ['id'])),
        set({}, 'rate',get(input, ['rate'])),
        set({}, 'currencyCode', get(input, ['currency'])),
        set({}, 'packageCode', get(input, ['packageCode'])),
        set({}, 'amenityName', get(input, ['name'])),
        set({}, 'hotelId', get(input, ['hotelId'])),
        set({}, 'imgUrl', get(input, ['imageUrl']))
      );
      return this;
    }
  }
