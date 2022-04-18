import { get, set } from 'lodash';

export interface Deserializable {
  deserialize(input: any): this;
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
  // status: boolean;
  description: string;
  name: string;
  hotelId: string;
  imageUrl: string;
  type: string;
  active: boolean;


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



export enum AssetSource {
  Botshot = 'BOTSHOT',
  Pms = 'PMS',
}

export interface IpackageOptions {
  key: string;
  value: string;
}
