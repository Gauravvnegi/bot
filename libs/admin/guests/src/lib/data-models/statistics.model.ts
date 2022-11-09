import { get, set } from 'lodash';

export class Document {
  label: string;
  totalCount: number;
  statistics: Statistic[];

  deserialize(statistics: any) {
    this.statistics = new Array<Statistic>();
    Object.assign(
      this,
      set({}, 'label', get(statistics, ['label'])),
      set({}, 'totalCount', get(statistics, ['totalCount']))
    );
    Object.keys(statistics.documentStats).forEach((key) =>
      this.statistics.push(
        new Statistic().deserialize({
          label: labels[key],
          value: statistics.documentStats[key],
          color: colors[key],
        })
      )
    );
    return this;
  }
}

export class Statistic {
  label: string;
  color: string;
  value: number;

  deserialize(statistic) {
    Object.assign(
      this,
      set({}, 'label', get(statistic, ['label'])),
      set({}, 'color', get(statistic, ['color'])),
      set({}, 'value', get(statistic, ['value']))
    );
    return this;
  }
}

export class VIP {
  label: string;
  totalCount: number;
  dueIn: any;
  inHouse: any;
  dueOut: any;
  outGuest: any;

  deserialize(statistics: any) {
    Object.assign(
      this,
      set({}, 'label', get(statistics, ['label'])),
      set({}, 'totalCount', get(statistics, ['totalCount'])),
      set({}, 'dueIn', get(statistics, ['dueIn'])),
      set({}, 'inHouse', get(statistics, ['inHouse'])),
      set({}, 'dueOut', get(statistics, ['dueOut'])),
      set({}, 'outGuest', get(statistics, ['outGuest']))
    );
    return this;
  }
}

export class Payment {
  label: string;
  totalCount: number;
  statistics: Statistic[];

  deserialize(statistics: any) {
    this.statistics = new Array<Statistic>();
    Object.assign(
      this,
      set({}, 'label', get(statistics, ['label'])),
      set({}, 'totalCount', get(statistics, ['totalCount']))
    );
    Object.keys(statistics.guestPayment).forEach((key) =>
      this.statistics.push(
        new Statistic().deserialize({
          label: labels.payment[key],
          value: statistics.guestPayment[key],
          color: colors.payment[key],
        })
      )
    );
    return this;
  }
}

export class Status {
  label: string;
  totalCount: number;
  newGuestStats: any;
  checkinGuestStats: any;
  precheckinGuestStats: any;
  checkoutGuestStats: any;

  deserialize(statistics: any) {
    Object.assign(
      this,
      set({}, 'label', get(statistics, ['label'])),
      set({}, 'totalCount', get(statistics, ['totalCount'])),
      set({}, 'newGuestStats', get(statistics, ['newGuestStats'])),
      set({}, 'checkinGuestStats', get(statistics, ['checkinGuestStats'])),
      set(
        {},
        'precheckinGuestStats',
        get(statistics, ['precheckinGuestStats'])
      ),
      set({}, 'checkoutGuestStats', get(statistics, ['checkoutGuestStats']))
    );
    return this;
  }
}

export class Source {
  title: string;
  totalCount: number;
  statistics: Statistic[];

  deserialize(input) {
    this.statistics = new Array<Statistic>();
    Object.assign(
      this,
      set({}, 'label', get(input, ['label'])),
      set({}, 'totalCount', get(input, ['totalCount']))
    );
    Object.keys(input.sourceStats).forEach((key, i) =>
      this.statistics.push(
        new Statistic().deserialize({
          label: key.charAt(0).toUpperCase() + key.substr(1).toLowerCase(),
          value: input.sourceStats[key],
          color: defaultColors[i],
        })
      )
    );

    return this;
  }
}

export const colors = {
  INITIATED: '#FF8F00',
  PENDING: '#38649F',
  FAILED: '#EE1044',
  COMPLETED: '#389F99',
  payment: {
    FULL: '#3E8EF7',
    PARTIAL: '#FAA700',
    PENDING: '#FF4C52',
  },
};

export const labels = {
  INITIATED: 'Initiated',
  PENDING: 'Pending',
  FAILED: 'Rejected',
  COMPLETED: 'Accepted',
  payment: {
    FULL: 'Fully Received',
    PARTIAL: 'Partially Received',
    PENDING: 'Not Received',
  },
};
const defaultColors = [
  '#745AF2',
  '#3E8EF7',
  '#0BB2D4',
  '#FAA700',
  '#389F99',
  '#3E8EF7',
];
