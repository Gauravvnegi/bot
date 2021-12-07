import { CommunicationConfig } from 'libs/admin/shared/src/lib/constants/subscriptionConfig';
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

export class MessageOverallAnalytics {
  stat: IMessageOverallAnalytic[];
  total: number;

  deserialize(input) {
    this.stat = new Array<IMessageOverallAnalytic>();
    this.total = input?.sentCount?.today;

    Object.keys(input).forEach((item) => {
      if (item !== 'data')
        this.stat.push(
          new MessageOverallAnalytic().deserialize(
            {
              ...input[item],
              ...{
                color: config1.colors[item],
                label: config1.label[item],
                radius: config1.radius[item],
              },
            },
            this.total
          )
        );
    });
    return this;
  }
}

export class MessageOverallAnalytic {
  label: string;
  yesterday: number;
  today: number;
  graphvalue: number;
  comparisonPercentage: number;
  color: string;
  radius: number;
  progress: number;

  deserialize(input, total) {
    Object.assign(
      this,
      set({}, 'today', get(input, ['today'])),
      set({}, 'yesterday', get(input, ['yesterday'])),
      set({}, 'comparisonPercentage', get(input, ['comparisonPercentage'])),
      set({}, 'color', get(input, ['color'])),
      set({}, 'label', get(input, ['label'])),
      set({}, 'radius', get(input, ['radius']))
    );
    this.progress = total > 0 ? (this.today / total) * 100 : 0;
    this.graphvalue = 75;
    return this;
  }
}

export class CommunicationChannels {
  channels;

  deserialize(input) {
    this.channels = new Array<any>();

    input.forEach((data) => {
      this.channels.push({
        ...{
          active: data.active,
          label: data.label,
        },
        ...CommunicationConfig[data.name],
      });
    });

    return this;
  }
}

export const config1 = {
  colors: {
    deliveredCount: '#52B33F',
    sentCount: '#FFBF04',
    readCount: '#4BA0F5',
    failedCount: '#CC052B',
  },
  label: {
    deliveredCount: 'Delivered',
    sentCount: 'Sent',
    readCount: 'Read',
    failedCount: 'Failed',
  },
  radius: {
    deliveredCount: 75,
    sentCount: 85,
    readCount: 65,
    failedCount: 55,
  },
};

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

export type IMessageOverallAnalytic = Omit<
  MessageOverallAnalytic,
  'deserialize'
>;

export type IMessageOverallAnalytics = Omit<
  MessageOverallAnalytics,
  'deserialize'
>;
