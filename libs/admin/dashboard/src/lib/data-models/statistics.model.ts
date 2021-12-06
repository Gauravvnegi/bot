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
  comparisonPercent: number;

  deserialize(statistics: any) {
    Object.assign(
      this,
      set({}, 'comparisonPercent', get(statistics, ['comparisonPercent'])),
      set({}, 'currentlyArrived', get(statistics, ['completed'])),
      set({}, 'currentlyExpected', get(statistics, ['pending'])),
      set({}, 'maxExpected', get(statistics, ['total']))
    );
    return this;
  }
}

export class InhouseRequest {
  total: number;
  approved: number;
  pending: number;
  timeout: number;
  completed: number;
  compareStats: any;

  deserialize(statistics: any) {
    Object.assign(
      this,
      set({}, 'approved', get(statistics, ['approved'])),
      set({}, 'pending', get(statistics, ['pending'])),
      set({}, 'total', get(statistics, ['total'])),
      set({}, 'timeout', get(statistics, ['timeout'])),
      set({}, 'completed', get(statistics, ['completed'])),
      set({}, 'compareStats', get(statistics, ['compareStats']))
    );
    return this;
  }
}

export class Inhouse {
  adultCount: number;
  kidsCount: number;
  totalRoom: number;
  roomOccupied: number;
  comparisonPercent: number;

  deserialize(statistics: any) {
    Object.assign(
      this,
      set({}, 'adultCount', get(statistics, ['adults'])),
      set({}, 'kidsCount', get(statistics, ['kids'])),
      set({}, 'totalRoom', get(statistics, ['totalRooms'])),
      set({}, 'roomOccupied', get(statistics, ['roomOccupied'])),
      set({}, 'comparisonPercent', get(statistics, ['comparisonPercent']))
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
  new: any;
  checkIn: any;
  expressCheckIn: any;
  checkout: any;
  expressCheckout: any;

  deserialize(statistics: any) {
    Object.assign(
      this,
      set({}, 'new', get(statistics, ['newJourneyStats'])),
      set({}, 'checkIn', get(statistics, ['checkinStats'])),
      set({}, 'expressCheckIn', get(statistics, ['expressCheckinStats'])),
      set({}, 'checkout', get(statistics, ['checkoutStats'])),
      set({}, 'expressCheckout', get(statistics, ['expressCheckoutStats']))
    );
    return this;
  }
}

export class BookingStatus {
  new: any;
  checkIn: any;
  preCheckIn: any;
  checkout: any;

  deserialize(statistics: any) {
    Object.assign(
      this,
      set({}, 'new', get(statistics, ['newGuestStats'])),
      set({}, 'checkIn', get(statistics, ['checkinGuestStats'])),
      set({}, 'preCheckIn', get(statistics, ['precheckinGuestStats'])),
      set({}, 'checkout', get(statistics, ['checkoutGuestStats']))
    );
    return this;
  }
}

export class ReservationStat {
  checkin: any;
  checkout: any;
  legends: any[];

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'checkin', get(input, ['checkin'])),
      set({}, 'checkout', get(input, ['checkout']))
    );
    this.legends = [
      [
        { label: 'Check-In', color: '#0ea47a', value: input?.checkin?.checkIn },
        {
          label: 'Ex Check-In',
          color: '#15eda3',
          value: input?.checkin?.expressCheckIn,
        },
      ],
      [
        {
          label: 'Check-Out',
          color: '#ff4545',
          value: input?.checkout?.checkout,
        },
        {
          label: 'Ex Check-Out',
          color: '#ff9867',
          value: input?.checkout.expressCheckout,
        },
      ],
    ];
    return this;
  }
}

export const config = {
  radius: {
    Failed: 55,
    Read: 65,
    Delivered: 75,
    Sent: 85,
  },
  color: {
    Failed: '#cc052b',
    Read: '#4ba0f5',
    Delivered: '#52b33f',
    Sent: '#ffbf04',
  },
};
