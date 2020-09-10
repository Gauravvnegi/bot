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

export class Package implements Deserializable{
    id: string;
    status:boolean;
    description: string;
    name: string;
    currencyCode: string;
    hotelId: string;
    packageCode: string;
    imageUrl: string;
    rate: number;
    type: string;

    deserialize(input: any) {
        Object.assign(
          this,
          set({}, 'id', get(input, ['id'])),
          set({}, 'name', get(input, ['amenityName'])),
          set({}, 'status', get(input, ['active'])),
          set({}, 'description', get(input, ['amenityDescription'])),
          set({}, 'currencyCode', get(input, ['currencyCode'])),
          set({}, 'packageCode', get(input, ['packageCode'])),
          set({}, 'imageUrl', get(input, ['imgUrl'])),
          set({}, 'rate', get(input, ['rate'])),
          set({}, 'type', (get(input, ['type'])) == 0 ? 'Complimentary':'Paid'),
        );
        return this;
    }
}

export class Amenity{
    active: boolean;
    hotelId: string;
    id: string;
    imgUrl: string;
    packageCode: string;
    amenityName: string;
}