import { get, set } from 'lodash';

export interface Deserializable {
  deserialize(input: any): this;
}

export class AssetDetail implements Deserializable {
  amenityasset: Asset;
  deserialize(input: any) {
    this.amenityasset = new Asset().deserialize(input);
    return this;
  }
}

export class Assets implements Deserializable {
  records: Asset[];
  deserialize(input: any) {
    this.records = input.records.map((record: any) =>
      new Asset().deserialize(record)
    );
    return this;
  }
}

export class Asset implements Deserializable {
  id: string;
  status: boolean;
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
  categoryName: string;
  category: string;
  url: string;
  active: boolean;
  records: any[];

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
      set({}, 'categoryName', get(input, ['categoryName']) || ''),
      set({}, 'category', get(input, ['parentId']) || ''),
      set({}, 'type', get(input, ['type'])),
      set({}, 'url', get(input, ['url'])),
      set({}, 'active', get(input, ['active']))
    );
    return this;
  }
}

export class Amenity {
  id: string;
  parentId: string;
  name: string;
  description: string;
  quantity: number;
  rate: number;
  startDate: number;
  endDate: number;
  active: boolean;
  currency: string;
  packageCode: string;
  imageUrl: string;
  hotelId: string;
  source: string;
  type: string;
  unit: string;
  downloadUrl: string;
  autoAccept: boolean;
}

export enum AssetSource {
  Botshot = 'BOTSHOT',
  Pms = 'PMS',
}

export interface IpackageOptions {
  key: string;
  value: string;
}
