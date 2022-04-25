import { get, set } from 'lodash';

export interface Deserializable {
  deserialize(input: any): this;
}

export class Topics implements Deserializable {
  records: Topic[];
  deserialize(input: any) {
    this.records = input.records.map((record: any) =>
      new Topic().deserialize(record)
    );
    return this;
  }
}

export class Topic implements Deserializable {
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

// export class Topic {
//   id: string;
//   status: boolean;
//   description: string;
//   name: string;
//   hotelId: string;
//   active: boolean;

//   deserialize(input: any) {
//     Object.assign(
//       this,
//       set({}, 'id', get(input, ['id'])),
//       set({}, 'name', get(input, ['name'])),
//       set({}, 'status', get(input, ['active'])),
//       set({}, 'description', get(input, ['description'])),
//       set({}, 'hotelId', get(input, ['hotelId'])),
//       set({}, 'active', get(input, ['active']))
//     );
//     return this;
//   }
// }

// export type ITopic = Omit<Topic, 'deserialize'>;
// export type ITopics = Omit<Topics, 'deserialize'>;
