import { get, set } from 'lodash';

export class InhouseSource {
  inhouseRequestSourceStats: any;
  label: string;
  totalCount: number;

  deserialize(input: any) {
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
        color: colors[index],
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
    keys.forEach((key) => {
      if (key !== 'label' && key !== 'totalCount') {
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
