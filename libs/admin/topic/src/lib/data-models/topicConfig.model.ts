import { get, set } from 'lodash';

export interface Deserializable {
    deserialize(input: any): this;
}

export class TopicDetail implements Deserializable{
    amenityTopic : Topic;
    deserialize(input: any) {
        this.amenityTopic = new Topic().deserialize(input);
        return this;
    }
}

export class Topics implements Deserializable{
    records: Topic[];
    deserialize(input: any) {
        this.records = input.records.map((record:any) =>
          new Topic().deserialize(record)
        );
        return this;
      }
}

export class Topic implements Deserializable{
    id: string;
    status:boolean;
    description: string;
    name: string;
    // currency: string;
    hotelId: string;
    topicCode: string;
    // imageUrl: string;
    rate: number;
    topicSource: string;
    unit: string;
    quantity: number;
    type: string;
    autoAccept: boolean;
    categoryName : string;
    category: string;
  records: any[];

    deserialize(input: any) {
        Object.assign(
          this,
          set({}, 'id', get(input, ['id'])),
          set({}, 'name', get(input, ['name'])),
          set({}, 'status', get(input, ['active'])),
          set({}, 'description', get(input, ['description'])),
        //   set({}, 'currency', get(input, ['currency'])),
          set({}, 'hotelId',get(input,['hotelId'])),
          set({}, 'topicCode', get(input, ['topicCode'])),
        //   set({}, 'imageUrl', get(input, ['imageUrl'])),
          set({}, 'rate', get(input, ['rate'])),
          set({}, 'quantity', get(input, ['quantity'])),
          set({}, 'topicSource', get(input, ['source'])),
          set({}, 'unit', get(input, ['unit'])),
          set({}, 'autoAccept', get(input, ['autoAccept'])),
          set({}, 'categoryName', get(input, ['categoryName'])||''),
          set({}, 'category', get(input, ['parentId'])||''),
          set({}, 'type', (get(input, ['rate'])) == 0 ? 'Complimentary':'Paid'),
        );
        return this;
    }
}

export class Amenity{
     id : string;
     parentId: string;
     name : string;
     description :  string ;
     quantity : number;
     rate : number;
     startDate : number;
     endDate : number;
     active : boolean;
    //  currency :  string;
     topicCode :  string;
    //  imageUrl : string;
     hotelId :  string;
     source: string;
     type :  string;
     unit :  string;
    //  downloadUrl : string; 
     autoAccept :boolean;
}

export enum TopicSource {
    Botshot = 'BOTSHOT',
	Pms = 'PMS'
}

export interface ItopicOptions {
    key: string;
    value: string;
}