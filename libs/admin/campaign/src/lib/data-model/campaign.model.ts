import { get, set } from 'lodash';

export interface Deserializable {
  deserialize(input: any): this;
}

export class Campaigns implements Deserializable {
  records: Campaign[];
  deserialize(input: any) {
    this.records = input.records.map((record: any) =>
      new Campaign().deserialize(record)
    );
    return this;
  }
}

export class Campaign implements Deserializable {
  id: string;
  name: string;
  hotelId: string;
  active: boolean;
  statsCampaign;
  templateName: string;
  isDraft: boolean;
  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'id', get(input, ['id'])),
      set({}, 'name', get(input, ['name'])),
      set({}, 'status', get(input, ['active'])),
      set({}, 'hotelId', get(input, ['hotelId'])),
      set({}, 'active', get(input, ['active'])),
      set({}, 'statsCampaign', get(input, ['statsCampaign'])),
      set({}, 'templateName', get(input, ['templateName'])),
      set({}, 'isDraft', get(input, ['isDraft']))
    );
    return this;
  }
}
