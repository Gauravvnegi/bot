import { ValueFormatter } from 'libs/admin/shared/src/lib/utils/valueFormatter';
import { get, set } from 'lodash';

export class SentimentsByRatings {
  stats: Sentiment[];
  labels: string[];
  score: number;
  comparisonPercent: number;
  additionalData: string;
  label: string;
  tooltip: string;
  deserialize(input) {
    this.labels = Object.keys(input.graphData);
    Object.assign(
      this,
      set({}, 'tooltip', get(input, ['tooltip'])),
      set({}, 'label', get(input, ['label'])),
      set({}, 'score', get(input, ['score'])),
      set({}, 'comparisonPercent', get(input, ['comparisonPercent'])),
      set(
        {},
        'additionalData',
        ValueFormatter(get(input, ['totalCount'], 0), 2)
      )
    );
    this.stats = this.labels.map((key) =>
      new Sentiment().deserialize({
        ...input.graphData[key],
      })
    );
    return this;
  }
}

export class Sentiment {
  label: string;
  positive: number;
  negative: number;
  neutral: number;

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'label', get(input, ['label'])),
      set({}, 'positive', parseFloat(get(input, ['positive']))),
      set({}, 'negative', parseFloat(get(input, ['negative']))),
      set({}, 'neutral', parseFloat(get(input, ['neutral'])))
    );
    return this;
  }
}

export class SentimentByTopic {
  stats: Sentiment[];

  deserialize(input) {
    this.stats = Object.keys(input).map((key) =>
      new Sentiment().deserialize({
        ...input[key],
        label: key,
      })
    );
    return this.stats;
  }
}

export class Topic {
  label: string;
  value: number;

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'label', get(input, ['label'])),
      set({}, 'value', get(input, ['value']))
    );
    return this;
  }
}

export class Topics {
  topics: Topic[];
  colors: string[];
  label: string;
  tooltip: string;
  deserialize(input, colorConfig) {
    this.topics = new Array<Topic>();
    this.colors = new Array<string>();
    Object.assign(
      this,
      set({}, 'label', get(input, ['label'])),
      set({}, 'tooltip', get(input, ['tooltip']))
    );
    input.topics.forEach((item) => {
      this.topics.push(new Topic().deserialize(item));
      this.colors.push(
        colorConfig[item.label.toLowerCase().split(' ').join('')]
      );
    });

    return this;
  }
}

export class OverallSentiments {
  positive: number;
  negative: number;
  neutral: number;
  total: number;

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'total', get(input, ['totalComments'])),
      set({}, 'positive', get(input, ['positive'])),
      set({}, 'negative', get(input, ['negative'])),
      set({}, 'neutral', get(input, ['neutral']))
    );
    return this;
  }
}

export class TopicsOverTimes {
  topics: TopicsOverTime[];
  colors: BarGraphColor[];
  defaultDataset: IStackItem[];
  labels: string[];
  score: number;
  comparisonPercent: number;
  additionalData: string;
  label: string;
  tooltip: string;
  deserialize(input, colorConfig) {
    this.labels = new Array<string>();
    Object.assign(
      this,
      set({}, 'tooltip', get(input, ['tooltip'])),
      set({}, 'label', get(input, ['label'])),
      set({}, 'score', get(input, ['score'])),
      set({}, 'comparisonPercent', get(input, ['comparisonPercent'])),
      set(
        {},
        'additionalData',
        ValueFormatter(get(input, ['totalCount'], 0), 2)
      )
    );
    const keys = Object.keys(input.graphData);
    this.topics = keys.map((key) => {
      this.labels.push(key);
      return new TopicsOverTime().deserialize({
        data: input.graphData[key],
      });
    });
    this.defaultDataset = this.topics[0].data.map((item) => {
      return {
        data: [],
        label: item.label,
        stack: 'a',
      };
    });
    this.colors = Object.keys(input.graphData[keys[0]]).map((key) =>
      new BarGraphColor().deserialize({
        backgroundColor: colorConfig[key.toLowerCase().split(' ').join('')],
      })
    );
    return this;
  }
}

interface IStackItem {
  data: number[];
  label: string;
  stack: string;
}

export class TopicsOverTime {
  data: Topic[];

  deserialize(input) {
    this.data = Object.keys(input.data).map((key) =>
      new Topic().deserialize({
        label: key,
        value: input.data[key],
      })
    );
    return this;
  }
}

export class SentimentOverTime {
  stats: Sentiment[];
  colors: any[];
  labels: string[];
  defaultDataset: any[];
  score: number;
  comparisonPercent: number;
  additionalData: string;
  label: string;
  deserialize(input, colorConfig) {
    this.labels = new Array<string>();
    this.stats = Object.keys(input.graphData).map((key) => {
      this.labels.push(key);
      return new Sentiment().deserialize({
        ...input.graphData[key],
        label: key,
      });
    });
    Object.assign(
      this,
      set({}, 'label', get(input, ['label'])),
      set({}, 'score', get(input, ['score'])),
      set({}, 'comparisonPercent', get(input, ['comparisonPercent'])),
      set(
        {},
        'additionalData',
        ValueFormatter(get(input, ['totalCount'], 0), 2)
      )
    );
    this.colors = [
      {
        borderColor: colorConfig.positive,
        backgroundColor: colorConfig.positiveBackground,
      },
      {
        borderColor: colorConfig.neutral,
        backgroundColor: colorConfig.neutralBackground,
      },
      {
        borderColor: colorConfig.negative,
        backgroundColor: colorConfig.negativeBackground,
      },
    ];
    return this;
  }
}

export class BarGraphColor {
  backgroundColor: string;
  borderColor: string;

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'backgroundColor', get(input, ['backgroundColor'])),
      set({}, 'borderColor', get(input, ['borderColor']))
    );
    return this;
  }
}
