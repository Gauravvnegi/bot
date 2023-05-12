import { get, set } from 'lodash';

export class SentimentDataTable {
  records: Sentiment[];

  deserialize(input) {
    this.records = input?.map((item) => new Sentiment().deserialize(item));
    return this;
  }
}

export class Sentiment {
  rating: number;
  comment: string;
  sentiment: string;
  topics: string[];

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'rating', get(input, ['rating'])),
      set({}, 'comment', get(input, ['comment'])),
      set({}, 'sentiment', get(input, ['sentiment'])),
      set({}, 'topics', get(input, ['topics'], []))
    );
    return this;
  }
}
