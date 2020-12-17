import { get, set } from 'lodash';

export interface Deserializable {
    deserialize(input: any): this;
}

export class PackageDetail implements Deserializable{
    amenityPackage : Package;
    deserialize(input: any) {
        this.amenityPackage = new Package().deserialize(input);
        return this;
    }
}

export class Packages implements Deserializable{
    records: Package[];
    deserialize(input: any) {
        this.records = input.records.map((record) =>
          new Package().deserialize(record)
        );
        return this;
      }
}

export class Package implements Deserializable{
    id: string;
    status:boolean;
    description: string;
    name: string;
    currency: string;
    hotelId: string;
    packageCode: string;
    imageUrl: string;
    rate: number;
    packageSource: string;
    unit: string;
    quantity: number;
    type: string;
    autoAccept: boolean;
    categoryName : string;

    deserialize(input: any) {
        Object.assign(
          this,
          set({}, 'id', get(input, ['id'])),
          set({}, 'name', get(input, ['name'])),
          set({}, 'status', get(input, ['active'])),
          set({}, 'description', get(input, ['description'])),
          set({}, 'currency', get(input, ['currency'])),
          set({}, 'packageCode', get(input, ['packageCode'])),
          set({}, 'imageUrl', get(input, ['imageUrl'])),
          set({}, 'rate', get(input, ['rate'])),
          set({}, 'quantity', get(input, ['quantity'])),
          set({}, 'packageSource', get(input, ['source'])),
          set({}, 'unit', get(input, ['unit'])),
          set({}, 'autoAccept', get(input, ['autoAccept'])),
          set({}, 'categoryName', get(input, ['categoryName'])||''),
          set({}, 'type', (get(input, ['rate'])) == 0 ? 'Complimentary':'Paid'),
        );
        return this;
    }
}

export class Amenity{
     id : string;
     parentId: string;
     name : string;
     description :  string ;
     quantity : number;
     rate : number;
     startDate : number;
     endDate : number;
     active : boolean;
     currency :  string;
     packageCode :  string;
     imageUrl : string;
     hotelId :  string;
     source: string;
     type :  string;
     unit :  string;
     downloadUrl : string; 
     autoAccept :boolean;
}