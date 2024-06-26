import { get, set } from 'lodash';

export interface IDeserializable {
  deserialize(input: any, hotelNationality: string): this;
}

export class FeedbackConfig implements IDeserializable {
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

export class Suggestion implements IDeserializable {
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
