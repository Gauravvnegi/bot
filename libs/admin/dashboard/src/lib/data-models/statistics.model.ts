import { get, set } from 'lodash';

export class Statistics {
  arrivals: Arrivals;
  inhouse: Inhouse;
  inhouseRequest: InhouseRequest;
  expressCheckIn: ExpressCheckIn;
  expressCheckOut: ExpressCheckOut;
  departures: Departures;
  customer: Customer;

  deserialize(statistics: any) {
    this.arrivals = new Arrivals().deserialize(statistics.ARRIVALS);
    this.inhouse = new Inhouse().deserialize(statistics.INHOUSE);
    this.inhouseRequest = new InhouseRequest().deserialize(
      statistics.INHOUSEREQUEST
    );
    //this.expressCheckIn = new ExpressCheckIn().deserialize(statistics.arrivals.expressCheckIn);
    //this.expressCheckOut = new ExpressCheckOut().deserialize(statistics.departure.expressCheckout);
    this.departures = new Departures().deserialize(statistics.DEPARTURE);
    this.customer = new Customer();
    return this;
  }
}
export class Arrivals {
  currentlyArrived: number;
  currentlyExpected: number;
  maxExpected: number;

  deserialize(statistics: any) {
    Object.assign(
      this,
      set({}, 'currentlyArrived', get(statistics, ['completed'])),
      set({}, 'currentlyExpected', get(statistics, ['pending'])),
      set({}, 'maxExpected', get(statistics, ['total']))
    );
    return this;
  }
}

export class InhouseRequest {
  requestApproved: number;
  requestPending: number;
  totalRequest;

  deserialize(statistics: any) {
    Object.assign(
      this,
      set({}, 'requestApproved', get(statistics, ['approved'])),
      set({}, 'requestPending', get(statistics, ['pending'])),
      set({}, 'totalRequest', get(statistics, ['total']))
    );
    return this;
  }
}

export class Inhouse {
  adultCount: number;
  kidsCount: number;
  totalRoom: number;
  roomOccupied: number;

  deserialize(statistics: any) {
    Object.assign(
      this,
      set({}, 'adultCount', get(statistics, ['adults'])),
      set({}, 'kidsCount', get(statistics, ['kids'])),
      set({}, 'totalRoom', get(statistics, ['totalRooms'])),
      set({}, 'roomOccupied', get(statistics, ['roomOccupied']))
    );
    return this;
  }
}

export class ExpressCheckIn {
  expected: number;

  deserialize(statistics) {
    Object.assign(
      this,
      set({}, 'expected', get(statistics.expected, ['totalCount']))
    );
    return this;
  }
}

export class ExpressCheckOut {
  expected: number;

  deserialize(statistics) {
    Object.assign(
      this,
      set({}, 'expected', get(statistics.expected, ['totalCount']))
    );
    return this;
  }
}

export class Departures {
  expected: RoomData;
  actual: RoomData;

  deserialize(statistics: any) {
    this.expected = new RoomData().deserialize(statistics.expected);
    this.actual = new RoomData().deserialize(statistics.completed);
    return this;
  }
}

export class RoomData {
  totalCount: number;
  kids: number;
  adults: number;

  deserialize(statistics: any) {
    Object.assign(
      this,
      set({}, 'totalCount', get(statistics, ['total'])),
      set({}, 'kids', get(statistics, ['kids'])),
      set({}, 'adults', get(statistics, ['adults']))
    );
    return this;
  }
}

export class Customer {
  label: string;
  checkIn: any;
  expressCheckIn: any;
  checkout: any;
  expressCheckout: any;

  deserialize(statistics: any) {
    Object.assign(
      this,
      set({}, 'label', get(statistics, ['label'])),
      set({}, 'checkIn', get(statistics, ['checkinStats'])),
      set({}, 'expressCheckIn', get(statistics, ['expressCheckinStats'])),
      set({}, 'checkout', get(statistics, ['checkoutStats'])),
      set({}, 'expressCheckout', get(statistics, ['expressCheckoutStats']))
    );
    return this;
  }
}
