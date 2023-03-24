import { EntityStateCounts } from '@hospitality-bot/admin/library';
import { DateService } from '@hospitality-bot/shared/utils';
import { OfferListResponse, OfferResponse } from '../types/response';

export class Offer {
  id: string;
  name: string;
  description: string;
  packageCode: string;
  imageUrl: string;
  source: string;
  startDate: number;
  endDate: number;
  status: boolean;
  discountValue: number;
  discountType: string;

  deserialize(input: OfferResponse) {
    this.id = input.id;
    this.name = input.name;
    this.description = input.description;
    this.packageCode = input.packageCode;
    this.imageUrl = input.imageUrl;
    this.source = input.source;
    this.startDate = input.startDate;
    this.endDate = input.endDate;
    this.status = input.active;
    this.discountType = input.discountType;
    this.discountValue = input.discountValue;
    return this;
  }

  /**
   * Return the formatted date
   */
  getFormattedDate(inputDate: number, timezone = '+05:30', format = '') {
    return DateService.getDateFromTimeStamp(inputDate, format, timezone);
  }
}

export class OfferList {
  records: Offer[];
  total: number;
  entityStateCounts: EntityStateCounts;
  deserialize(input: OfferListResponse) {
    this.records = input.offers?.map((item) => new Offer().deserialize(item));
    this.total = input.total;
    this.entityStateCounts = new EntityStateCounts().deserialize(
      input.entityStateCounts
    );
    return this;
  }
}
