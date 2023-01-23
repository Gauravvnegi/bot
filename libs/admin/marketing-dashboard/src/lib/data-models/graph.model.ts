import { IDeserializable } from '@hospitality-bot/admin/shared';
import { GraphStatsData } from '../components/types/stats';

export class ComparisonGraphStats implements IDeserializable {
  labels: string[];
  primaryData: number[];
  secondaryData: number[];
  deserialize(input: GraphStatsData[]) {
    this.labels = new Array<string>();
    this.primaryData = new Array<number>();
    this.secondaryData = new Array<number>();

    input.forEach((item) => {
      this.labels.push(item['label']);
      this.primaryData.push(item['primaryData']);
      this.secondaryData.push(item['secondaryData']);
    });
    return this;
  }
}
