import { colors as randomColors } from '@hospitality-bot/admin/shared';
import { convertToTitleCase } from 'libs/admin/shared/src/lib/utils/valueFormatter';
import { get, set } from 'lodash';
import { SentimentStatsResponse } from '../types/response.types';

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

  deserialize(input: SentimentStatsResponse) {
    this.label = input.label;

    this.totalCount = input.totalCount;

    const keys = Object.keys(input);

    keys.forEach((key) => {
      const currItem = input[key];
      if (
        typeof currItem === 'object' &&
        'label' in currItem &&
        'totalCount' in currItem &&
        'stats' in currItem
      ) {
        this[key] = new Sentiment().deserialize(input[key]);
      }
    });

    return this;
  }
}

export class Sentiment {
  label: string;
  name: string;

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

    this.name = convertToTitleCase(this.label);

    return this;
  }
}

const colors = ['#2a8853', '#f76b8a', '#224bd5', '#30e3ca'];
