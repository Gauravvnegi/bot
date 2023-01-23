import { get, set, toInteger } from 'lodash';

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
                color: config.colors[item],
                label: config.label[item],
                radius: config.radius[item],
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
    this.progress = (this.today / total) * 100;
    this.graphvalue = 75;
    return this;
  }
}

export const config = {
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

export class SentdeliveredChart {
  labels: string[];
  sent: number[];
  delivered: number[];

  deserialize(input) {
    this.labels = new Array<string>();
    this.sent = new Array<number>();
    this.delivered = new Array<number>();
    const keys = Object.keys(input.sentMap);
    keys.forEach((i) => {
      this.sent.push(input.sentMap[i]);
      this.delivered.push(input.deliveredMap[i]);
      const time = toInteger(i);
      if (time < 12) {
        this.labels.push(`${time === 0 ? 12 : time}AM`);
      } else {
        this.labels.push(`${time > 12 ? time - 12 : time}PM`);
      }
    });
    return this;
  }
}

export class Conversation {
  statistics: Stat[];
  totalResponse: number;
  comparePercent: number;
  deserialize(input) {
    this.statistics = new Array<Stat>();
    Object.assign(
      this,
      set({}, 'totalResponse', get(input, ['totalMessage', 'overall'])),
      set(
        {},
        'comparePercent',
        get(input, ['totalMessage', 'comparisonPercentage'])
      )
    );
    this.statistics.push(
      new Stat().deserialize({
        label: 'Incoming',
        count: input.incoming.inBound,
        comparisonPercentage: input.incoming.comparisonPercentage,
        color: '#ffec8c',
      })
    );
    this.statistics.push(
      new Stat().deserialize({
        label: 'Outgoing',
        count: input.outgoing.outBound,
        comparisonPercentage: input.outgoing.comparisonPercentage,
        color: '#31bb92',
      })
    );
    return this;
  }
}

export class Notification {
  statistics: Stat[];
  total: number;
  comparisonPercentage: number;

  deserialize(input) {
    this.statistics = new Array<Stat>();
    Object.assign(
      this,
      set({}, 'total', get(input, ['totaltemplates', 'total'])),
      set(
        {},
        'comparisonPercentage',
        get(input, ['totaltemplates', 'comparisonPercentage'])
      )
    );
    this.statistics.push(
      new Stat().deserialize({
        label: 'Pre-Check-In',
        count: input.preCheckInCounts,
        color: '#3270eb',
      })
    );
    this.statistics.push(
      new Stat().deserialize({
        label: 'Post Check-In',
        count: input.checkInCounts,
        color: '#15eda3',
      })
    );
    this.statistics.push(
      new Stat().deserialize({
        label: 'Post Check-Out',
        count: input.checkOutCounts,
        color: '#ff9867',
      })
    );

    return this;
  }
}

export class Stat {
  label: string;
  count: number;
  color: string;
  comparePercent: number;

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'label', get(input, ['label'])),
      set({}, 'count', get(input, ['count'])),
      set({}, 'comparePercent', get(input, ['comparisonPercentage'])),
      set({}, 'color', get(input, ['color']))
    );
    return this;
  }
}

export type IMessageOverallAnalytic = Omit<
  MessageOverallAnalytic,
  'deserialize'
>;

export type IMessageOverallAnalytics = Omit<
  MessageOverallAnalytics,
  'deserialize'
>;

export type ISentdeliveredChart = Omit<SentdeliveredChart, 'deserialize'>;
