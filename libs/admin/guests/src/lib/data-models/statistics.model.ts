import { get, set } from 'lodash';

export class Document {
  label: string;
  totalCount: number;
  PENDING: number;
  INITIATED: number;
  REJECTED: number;
  ACCEPTED: number;

  deserialize(statistics: any) {
    Object.assign(
      this,
      set({}, 'label', get(statistics, ['label'])),
      set({}, 'totalCount', get(statistics, ['totalCount'])),
      set({}, 'PENDING', get(statistics, ['documentStats', 'PENDING'])),
      set({}, 'INITIATED', get(statistics, ['documentStats', 'INITIATED'])),
      set({}, 'REJECTED', get(statistics, ['documentStats', 'FAILED'])),
      set({}, 'ACCEPTED', get(statistics, ['documentStats', 'COMPLETED']))
    );
    return this;
  }
}

export class VIP {
  label: string;
  totalCount: number;
  arrival: any;
  inHouse: any;
  departure: any;
  outGuest: any;

  deserialize(statistics: any) {
    Object.assign(
      this,
      set({}, 'label', get(statistics, ['label'])),
      set({}, 'totalCount', get(statistics, ['totalCount'])),
      set({}, 'arrival', get(statistics, ['arrival'])),
      set({}, 'inHouse', get(statistics, ['inHouse'])),
      set({}, 'departure', get(statistics, ['departure'])),
      set({}, 'outGuest', get(statistics, ['outGuest']))
    );
    return this;
  }
}

export class Payment {
  label: string;
  totalCount: number;
  FULL: number;
  PARTIAL: number;
  PENDING: number;

  deserialize(statistics: any) {
    Object.assign(
      this,
      set({}, 'label', get(statistics, ['label'])),
      set({}, 'totalCount', get(statistics, ['totalCount'])),
      set({}, 'FULL', get(statistics, ['guestPayment', 'FULL'])),
      set({}, 'PARTIAL', get(statistics, ['guestPayment', 'PARTIAL'])),
      set({}, 'PENDING', get(statistics, ['guestPayment', 'PENDING']))
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
  sourceStats: any;
  total: number;

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'title', get(input, ['label'])),
      set({}, 'sourceStats', get(input, ['sourceStats'])),
      set({}, 'total', get(input, ['totalCount']))
    );

    return this;
  }
}
