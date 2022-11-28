import { get, set } from 'lodash';
import { IDeserializable } from '@hospitality-bot/admin/shared';

export class MarketingStats implements IDeserializable {
  CONVERSION_RATE: ChipStats;
  CTR: ChipStats;
  TOTAL_CLICKS: ChipStats;
  TOTAL_EMAIL_SENT: ChipStats;
  TOTAL_OPEN_RATE: ChipStats;
  deserialize(input) {
    this.CONVERSION_RATE = new ChipStats().deserialize(input.CONVERSION_RATE);
    this.CTR = new ChipStats().deserialize(input.CTR);
    this.TOTAL_CLICKS = new ChipStats().deserialize(input.TOTAL_CLICKS);
    this.TOTAL_EMAIL_SENT = new ChipStats().deserialize(input.TOTAL_EMAIL_SENT);
    this.TOTAL_OPEN_RATE = new ChipStats().deserialize(input.TOTAL_OPEN_RATE);
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

export class ContactStat implements IDeserializable {
  totalContact: number;
  stats: StatsContact[];

  deserialize(input) {
    this.stats = new Array<StatsContact>();
    const data = input['CONTACT_STATS'];
    Object.keys(data).forEach((key) => {
      if (key !== 'TOTAL_CONTACT') {
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
