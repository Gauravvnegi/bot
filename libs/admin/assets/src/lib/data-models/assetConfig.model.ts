import { get, set } from 'lodash';
import { EntityState, IDeserializable } from '@hospitality-bot/admin/shared';

export class Assets implements IDeserializable {
  records: Asset[];
  total: number;
  entityStateCounts: EntityState<string>;
  entityTypeCounts: EntityState<string>;
  deserialize(input: any) {
    this.records = input.records.map((record: any) =>
      new Asset().deserialize(record)
    );
    this.total = input.total;
    this.entityStateCounts = input.entityStateCounts;
    this.entityTypeCounts = input.entityTypeCounts;
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
