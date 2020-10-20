import { get, set } from 'lodash';
import { DateService } from '../../../../../shared/utils/src/lib/date.service';
import * as moment from 'moment';

export interface Deserializable {
  deserialize(input: any, hotelNationality: string): this;
}

export class FeedbackConfig implements Deserializable {
  suggestions;
  suggestionsObj = {};
  deserialize(input) {
    this.suggestions = input.suggestions.map((suggestion) => {
      this.suggestionsObj[suggestion.id] = new Suggestion().deserialize(
        suggestion
      );
      return new Suggestion().deserialize(suggestion);
    });
    return this;
  }
}

export class Suggestion implements Deserializable {
  id;
  label;
  url;
  deserialize(input) {
    Object.assign(
      this,
      set({}, 'id', get(input, ['id'])),
      set({}, 'label', get(input, ['label'])),
      set({}, 'url', get(input, ['url']))
    );
    return this;
  }
}
