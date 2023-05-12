import { get, set } from 'lodash';

export interface Deserializable {
  deserialize(reservation: any, arrivalTime: string): this;
}

export class AmenitiesDetailDS implements Deserializable {
  amenities: AmenitiesDetail;
  arrivalTime: string;

  deserialize(input: any, arrivalTime: string) {
    this.arrivalTime = arrivalTime;
    this.amenities = new AmenitiesDetail().deserialize(input);
    return this;
  }
}

export class AmenitiesDetail implements Deserializable {
  complimentaryServicesDetail = [];
  paidServicesDetail = [];

  deserialize(input: any) {
    Object.assign(
      this,
      set(
        {},
        'complimentaryServicesDetail',
        get(input, ['complimentaryPackages'])
      ),
      set({}, 'paidServicesDetail', get(input, ['paidPackages']))
    );
    return this;
  }
}
