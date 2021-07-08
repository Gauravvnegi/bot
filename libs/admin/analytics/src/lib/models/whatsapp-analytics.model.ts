import { get, set } from 'lodash';

export class MessageStat {
  stat: IStat[];

  deserialize(input) {
    this.stat = new Array<IStat>();

    Object.keys(input).forEach((item) => {
      if (item !== 'data')
        this.stat.push(
          new Stat().deserialize({
            ...input[item],
            ...{
              color: config.colors[item],
              label: config.label[item],
              radius: config.radius[item],
            },
          })
        );
    });
    return this.stat;
  }
}

export class Stat {
  label: string;
  yesterday: number;
  today: number;
  graphvalue: number;
  comparisonPercentage: number;
  color: string;
  radius: number;

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'today', get(input, ['today'])),
      set({}, 'yesterday', get(input, ['yesterday'])),
      set({}, 'comparisonPercentage', get(input, ['comparisonPercentage'])),
      set({}, 'color', get(input, ['color'])),
      set({}, 'label', get(input, ['label'])),
      set({}, 'radius', get(input, ['radius']))
    );
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

export type IStat = Omit<Stat, 'deserialize'>;
