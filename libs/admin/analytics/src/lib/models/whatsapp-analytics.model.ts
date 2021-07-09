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

export type IMessageOverallAnalytic = Omit<
  MessageOverallAnalytic,
  'deserialize'
>;

export type IMessageOverallAnalytics = Omit<
  MessageOverallAnalytics,
  'deserialize'
>;

export type ISentdeliveredChart = Omit<SentdeliveredChart, 'deserialize'>;
