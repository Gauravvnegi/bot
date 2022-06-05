import { get, set } from 'lodash';

export interface Deserializable {
  deserialize(input: any): this;
}

export class MarketingStats implements Deserializable {
  openRate: OpenRate;
  ctr: CTR;
  totalClicked: TotalClicked;
  conversionRate: ConversionRate;
  totalSent: TotalSent;
  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'openRate', new OpenRate().deserialize(input)),
      set({}, 'ctr', new CTR().deserialize(input)),
      set({}, 'totalClicked', new TotalClicked().deserialize(input)),
      set({}, 'conversionRate', new ConversionRate().deserialize(input)),
      set({}, 'totalSent', new TotalSent().deserialize(input))
    );
    return this;
  }
}
export class OpenRate implements Deserializable {
  label: string;
  score: number;
  comparisonPercent: number;
  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'label', get(input, ['Total Open Rate', 'label'])),
      set({}, 'score', get(input, ['Total Open Rate', 'score'])),
      set(
        {},
        'comparisonPercent',
        get(input, ['Total Open Rate', 'comparisonPercent'])
      )
    );
    return this;
  }
}
export class CTR implements Deserializable {
  label: string;
  score: number;
  comparisonPercent: number;
  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'label', get(input, ['CTR', 'label'])),
      set({}, 'score', get(input, ['CTR', 'score'])),
      set({}, 'comparisonPercent', get(input, ['CTR', 'comparisonPercent']))
    );
    return this;
  }
}
export class TotalClicked implements Deserializable {
  label: string;
  score: number;
  comparisonPercent: number;
  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'label', get(input, ['Total Clicks', 'label'])),
      set({}, 'score', get(input, ['Total Clicks', 'score'])),
      set(
        {},
        'comparisonPercent',
        get(input, ['Total Clicks', 'comparisonPercent'])
      )
    );
    return this;
  }
}
export class ConversionRate implements Deserializable {
  label: string;
  score: number;
  comparisonPercent: number;
  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'label', get(input, ['Conversion Rate', 'label'])),
      set({}, 'score', get(input, ['Conversion Rate', 'score'])),
      set(
        {},
        'comparisonPercent',
        get(input, ['Conversion Rate', 'comparisonPercent'])
      )
    );
    return this;
  }
}
export class TotalSent implements Deserializable {
  label: string;
  score: number;
  comparisonPercent: number;
  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'label', get(input, ['Total Email Sent', 'label'])),
      set({}, 'score', get(input, ['Total Email Sent', 'score'])),
      set(
        {},
        'comparisonPercent',
        get(input, ['Total Email Sent', 'comparisonPercent'])
      )
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
