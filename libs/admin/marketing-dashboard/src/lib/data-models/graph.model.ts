import { IDeserializable } from '@hospitality-bot/admin/shared';

export class RateGraphStats {
  label: string[];
  clickRate: number[];
  openRate: number[];
  deserialize(input) {
    this.label = new Array<string>();
    this.clickRate = new Array<number>();
    this.openRate = new Array<number>();
    input.forEach((item) => {
      this.label.push(item['label']);
      this.clickRate.push(item['clickRate']);
      this.openRate.push(item['openRate']);
    });
    return this;
  }
}

export class SubscriberGraphStats {
  labels: string[];
  unsubscribers: number[];
  subscribers: number[];
  deserialize(input) {
    this.labels = new Array<string>();
    this.unsubscribers = new Array<number>();
    this.subscribers = new Array<number>();
    input.forEach((item) => {
      const key = Object.keys(item)[0];
      this.labels.push(key);
      this.unsubscribers.push(item[key]['Unsubscribers']);
      this.subscribers.push(item[key]['Subscribers']);
    });
    return this;
  }
}
