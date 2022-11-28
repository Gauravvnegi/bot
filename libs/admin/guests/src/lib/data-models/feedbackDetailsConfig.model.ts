import { get, set } from 'lodash';
import { IDeserializable } from '@hospitality-bot/admin/shared';

export class FeedbackConfigDS implements IDeserializable {
  feedBackConfig: FeedBackDetail;

  deserialize(input: any) {
    this.feedBackConfig = new FeedBackDetail().deserialize(input);
    return this;
  }
}

export class FeedBackDetail implements IDeserializable {
  ratingScale: number[];
  negativeTitle: string;
  positiveTitle: string;
  suggestions = new Array<Suggestion>();
  ratingScaleConfig;
  id: string;

  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'id', get(input, ['_id'])),
      set({}, 'positiveTitle', get(input, ['positive_title'])),
      set({}, 'negativeTitle', get(input, ['negative_title'])),
      set({}, 'ratingScale', get(input, ['ratingScale'])),
      set({}, 'suggestions', get(input, ['suggestions'])),
      set({}, 'ratingScaleConfig', get(input, ['ratingScaleConfig']))
    );

    // this.suggestions.length > 0 &&
    //   this.suggestions.forEach((suggestion) => {
    //     suggestion.id = `SER${Math.random().toString(36).substring(7)}`;
    //   });
    return this;
  }
}

export interface FeedbackConfigI {
  created_time: number;
  ratingScale: number[];
  negative_title: string;
  ratingScaleConfig;
  suggestions: Suggestion[];
  _id: string;
  positive_title: string;
}

export interface Suggestion {
  label: string;
  url: string;
  id: string;
}

export class FeedbackData {
  guestId: string;
  rating: number;
  comments: string;
  services: Service[];
}

export class Service {
  serviceId: string;
  serviceName: string;
}
