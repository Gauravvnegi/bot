import { get, set } from 'lodash';
import { EntityState, IDeserializable } from '@hospitality-bot/admin/shared';

export class Topics implements IDeserializable {
  records: Topic[];
  total: number;
  entityStateCounts: EntityState<string>;
  entityTypeCounts: EntityState<string>;
  deserialize(input: any) {
    this.records = input?.records.map((record: any) =>
      new Topic().deserialize(record)
    );
    this.entityTypeCounts = input.entityTypeCounts;
    this.entityStateCounts = input.entityStateCounts;
    this.total = input?.total;

    return this;
  }
}

export class Topic implements IDeserializable {
  id: string;
  status: boolean;
  description: string;
  name: string;
  hotelId: string;
  active: boolean;

  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'id', get(input, ['id'])),
      set({}, 'name', get(input, ['name'])),
      set({}, 'status', get(input, ['active'])),
      set({}, 'description', get(input, ['description'])),
      set({}, 'hotelId', get(input, ['hotelId'])),
      set({}, 'active', get(input, ['active']))
    );
    return this;
  }
}
