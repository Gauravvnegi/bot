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
      set({}, 'type', get(input, ['type'])),
      set({}, 'url', get(input, ['url']))
    );
    return this;
  }
}
