import { DateService } from '@hospitality-bot/shared/utils';
import { OfferListResponse, OfferResponse } from '../types/response';
import { EntityState } from '@hospitality-bot/admin/shared';

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
  appliedOn: string;

  deserialize(input: OfferResponse) {
    this.id = input.id;
    this.name = input.name;
    this.description = input.description;
    this.packageCode = input.packageCode;
    this.source = input.source;
    this.startDate = input.startDate;
    this.endDate = input.endDate;
    this.status = input.active;
    this.discountType = input.discountType;
    this.discountValue = input.discountValue;
    if (input.imageUrl?.length > 0) this.imageUrl = input.imageUrl[0].url;

    const appliedOnNames = [];
    input.subPackages?.forEach((item) => appliedOnNames.push(item.name));
    input.roomTypes?.forEach((item) => appliedOnNames.push(item.name));
    this.appliedOn = appliedOnNames.join(', ');

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
  totalRecord: number;
  entityStateCounts: EntityState<string>;
  entityTypeCounts: EntityState<string>;

  deserialize(input: OfferListResponse) {
    debugger;
    this.records = input.offers?.map((item) => new Offer().deserialize(item));
    this.totalRecord = input.total;
    this.entityStateCounts = input.entityStateCounts;
    this.entityTypeCounts = input.entityTypeCounts;
    return this;
  }
}
