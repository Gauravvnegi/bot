import { get, set } from 'lodash';
import { colors as randomColors } from '@hospitality-bot/admin/shared';

export class InhouseSource {
  inhouseRequestSourceStats: any;
  label: string;
  totalCount: number;

  deserialize(input: any, config) {
    this.inhouseRequestSourceStats = {};
    Object.assign(
      this,
      set({}, 'label', get(input, ['label'])),
      set({}, 'totalCount', get(input, ['totalCount']))
    );

    const keys = Object.keys(input.requestSourceStats);

    keys.forEach((key, index) => {
      this.inhouseRequestSourceStats[key] = {
        value: input.requestSourceStats[key],
        color: randomColors[Math.floor(Math.random() * randomColors.length)],
      };
    });

    return this;
  }
}

export class InhouseSentiments {
  label: string;
  totalCount: number;

  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'label', get(input, ['label'])),
      set({}, 'totalCount', get(input, ['totalCount']))
    );

    const keys = Object.keys(input);
    const keysNotToBeIncluded = [
      'label',
      'totalCount',
      'comparisonPercent',
      'score',
    ];

    keys.forEach((key) => {
      // if (!['label', 'totalCount', 'packageTotalCounts'].includes(key)) {
      if (!keysNotToBeIncluded.includes(key)) {
        this[key] = new Sentiment().deserialize(input[key]);
      }
    });

    return this;
  }
}

export class Sentiment {
  label: string;
  stats: any;
  totalCount: number;
  color: string;

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'label', get(input, ['label'])),
      set({}, 'totalCount', get(input, ['totalCount'])),
      set({}, 'stats', get(input, ['stats']))
    );

    return this;
  }
}

const colors = ['#2a8853', '#f76b8a', '#224bd5', '#30e3ca'];
