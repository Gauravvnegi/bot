import { get, omit, set } from 'lodash';
import { IDeserializable } from '@hospitality-bot/admin/shared';

export class Topics implements IDeserializable {
  records: Topic[];
  total: number;
  entitySateCounts: IEntityStateCounts;
  entityTypeCounts: IEntityTypeCounts;
  deserialize(input: any) {
    this.records = input?.records.map((record: any) =>
      new Topic().deserialize(record)
    );
    this.entityTypeCounts = new EntityTypeCounts().deserialize(
      input?.entityTypeCounts,
      input.total
    );
    this.entitySateCounts = new EntitySateCounts().deserialize(
      input?.entityStateCounts
    );
    this.total = input?.total;

    return this;
  }
}

class EntitySateCounts {
  ALL: number;
  ACTIVE: number;
  INACTIVE: number;
  deserialize(input: any) {
    this.ALL =
      Number(
        Object.values(input)?.reduce((a: number, b: number) => a + b, 0)
      ) ?? 0;
    this.ACTIVE = input?.ACTIVE;
    this.INACTIVE = input?.INACTIVE;
    return this;
  }
}

class EntityTypeCounts {
  ALL: number;

  deserialize(input: any, total: number) {
    this.ALL = total ?? 0;
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

export type IEntityStateCounts = Omit<EntitySateCounts, 'deserialize'>;
export type IEntityTypeCounts = Omit<EntityTypeCounts, 'deserialize'>;
