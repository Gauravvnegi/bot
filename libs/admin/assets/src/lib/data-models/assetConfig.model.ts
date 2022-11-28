import { get, set } from 'lodash';
import { IDeserializable } from '@hospitality-bot/admin/shared';

export class Assets implements IDeserializable {
  records: Asset[];
  deserialize(input: any) {
    this.records = input.records.map((record: any) =>
      new Asset().deserialize(record)
    );
    return this;
  }
}

export class Asset implements IDeserializable {
  id: string;
  description: string;
  name: string;
  hotelId: string;
  url: string;
  type: string;
  active: boolean;
  thumbnailUrl: string;
  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'id', get(input, ['id'])),
      set({}, 'name', get(input, ['name'])),
      set({}, 'status', get(input, ['active'])),
      set({}, 'description', get(input, ['description'])),
      set({}, 'type', get(input, ['type'])),
      set({}, 'url', get(input, ['url'])),
      set({}, 'thumbnailUrl', get(input, ['thumbnailUrl']))
    );
    return this;
  }
}
