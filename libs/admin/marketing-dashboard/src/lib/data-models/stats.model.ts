import { get, set } from 'lodash';

export interface Deserializable {
  deserialize(input: any): this;
}

export class MarketingStats implements Deserializable {
  chips: ChipStats[];

  deserialize(input) {
    this.chips = new Array<ChipStats>();
    Object.keys(input).forEach((key) => {
      this.chips.push(new ChipStats().deserialize(input[key]));
    });
    return this;
  }
}

export class ChipStats {
  label: string;
  score: number;
  comparisonPercent: number;
  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'label', get(input, ['label'])),
      set({}, 'score', get(input, ['score'])),
      set({}, 'comparisonPercent', get(input, ['comparisonPercent']))
    );
    return this;
  }
}

const circleRadius = {
  BOUNCED: 95,
  SUBSCRIBED: 85,
  UNSUBSCRIBED: 75,
};

export class ContactStat implements Deserializable {
  totalContact: number;
  stats: StatsContact[];

  deserialize(input) {
    this.stats = new Array<StatsContact>();
    const data = input['Contact Stats'];
    Object.keys(data).forEach((key) => {
      if (key != 'TOTAL_CONTACT') {
        this.stats.push(
          new StatsContact().deserialize(data[key], circleRadius[key])
        );
      }
    });
    Object.assign(this, set({}, 'totalContact', get(data, ['TOTAL_CONTACT'])));
    return this;
  }
}

export class StatsContact {
  label: string;
  score: number;
  comparisonPercent: number;
  colorCode: string;
  radius: number;
  deserialize(input: any, radius: number) {
    Object.assign(
      this,
      set({}, 'label', get(input, ['label'])),
      set({}, 'score', get(input, ['score'])),
      set({}, 'comparisonPercent', get(input, ['comparisonPercent'])),
      set({}, 'colorCode', get(input, ['colourCode']))
    );

    this.radius = radius;
    return this;
  }
}
