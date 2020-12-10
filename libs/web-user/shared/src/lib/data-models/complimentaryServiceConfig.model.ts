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
        if(service.active){
          this.complimentaryService.push(new ComplimentaryServiceDetail().deserialize(service));
        }
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
    description: string;
    active:boolean;
    unit:string;
    hasChild:boolean;
    source:string;
    type:string;
    name: string;
  
    deserialize(input: any) {
      Object.assign(
        this,set({}, 'id',get(input, ['id'])),
        set({}, 'rate',get(input, ['rate'])),
        set({}, 'currencyCode', get(input, ['currency'])),
        set({}, 'packageCode', get(input, ['packageCode'])),
        set({}, 'name', get(input, ['name'])),
        set({}, 'imgUrl', get(input, ['imageUrl'])),
        set({}, 'description', get(input, ['description'])),
        set({}, 'active', get(input, ['active'])),
        set({}, 'unit', get(input, ['unit'])),
        set({}, 'hasChild', get(input, ['hasChild'])),
        set({}, 'autoAccept', get(input, ['autoAccept'])),
        set({}, 'source', get(input, ['source'])),
        set({}, 'type', get(input, ['type'])),
        set({}, 'quantity', get(input, ['quantity'])),
      );
      return this;
    }
  }
