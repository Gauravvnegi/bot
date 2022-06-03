
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

export class ContactStat implements Deserializable {
  bounced: Bounced;
  unsubscribed: Unsubscribed;
  subscribed :Subscribed;
  total:number;
  deserialize(input: any) {
    Object.assign(this,
        set({}, 'total', get(input, ['TOTAL_CONTACT'])),
         set({}, 'bounced', new Bounced().deserialize(input)),
         set({}, 'unsubscribed', new Unsubscribed().deserialize(input)),
         set({}, 'subscribed', new Subscribed().deserialize(input)),
         );
    
    return this;
  }
}

export class Bounced implements Deserializable {
  label: string;
  score: number;
  comparisonPercent: number;
  colourCode: string;
  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'label', get(input, ['BOUNCED', 'label'])),
      set({}, 'score', get(input, ['BOUNCED', 'score'])),
      set(
        {},
        'comparisonPercent',
        get(input, ['BOUNCED', 'comparisonPercent'])
      ),
      set({}, 'colourCode', get(input, ['BOUNCED', 'colourCode']))
    );
    return this;
  }
}

export class Unsubscribed implements Deserializable {
    label: string;
    score: number;
    comparisonPercent: number;
    colourCode: string;
    deserialize(input: any) {
      Object.assign(
        this,
        set({}, 'label', get(input, ['UNSUBSCRIBED', 'label'])),
        set({}, 'score', get(input, ['UNSUBSCRIBED', 'score'])),
        set(
          {},
          'comparisonPercent',
          get(input, ['UNSUBSCRIBED', 'comparisonPercent'])
        ),
        set({}, 'colourCode', get(input, ['UNSUBSCRIBED', 'colourCode']))
      );
      return this;
    } 
}
export class Subscribed implements Deserializable {
    label: string;
    score: number;
    comparisonPercent: number;
    colourCode: string;
    deserialize(input: any) {
      Object.assign(
        this,
        set({}, 'label', get(input, ['SUBSCRIBED', 'label'])),
        set({}, 'score', get(input, ['SUBSCRIBED', 'score'])),
        set(
          {},
          'comparisonPercent',
          get(input, ['SUBSCRIBED', 'comparisonPercent'])
        ),
        set({}, 'colourCode', get(input, ['SUBSCRIBED', 'colourCode']))
      );
      return this;
    } 
}