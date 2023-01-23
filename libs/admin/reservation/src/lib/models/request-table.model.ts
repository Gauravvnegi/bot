import { DateService } from '@hospitality-bot/shared/utils';
import { get, set } from 'lodash';
import * as moment from 'moment';
export interface IDeserializable {
  deserialize(input: any, hotelNationality: string): this;
}

export class RequestTable implements IDeserializable {
  records: Request[];
  deserialize(input: any, colorMap) {
    this.records = input.records.map((record) =>
      new Request().deserialize(record, colorMap)
    );
    return this;
  }
}

export class Request implements IDeserializable {
  id;
  bookingNumber: string;
  requestTimeStamp: number;
  message;
  type: string;
  color: string;
  deserialize(input, colorMap) {
    Object.assign(
      this,
      set({}, 'id', get(input, ['id'])),
      set({}, 'requestTimeStamp', get(input, ['date'])),
      set({}, 'bookingNumber', get(input, ['bookingNumber'])),
      set({}, 'message', get(input, ['message'])),
      set({}, 'type', get(input, ['type']))
    );
    if (input.message.overAllRating)
      this.color = this.getColor(
        { ...input, feedbackType: 'STAYFEEDBACK' },
        colorMap
      );
    return this;
  }

  getRequestDate(timezone = '+05:30') {
    return DateService.getDateFromTimeStamp(
      this.requestTimeStamp,
      'DD/M/YY',
      timezone
    );
  }

  getRequestTime(timezone = '+05:30') {
    return DateService.getDateFromTimeStamp(
      this.requestTimeStamp,
      'HH:mm',
      timezone
    );
  }

  getElapsedTime(timezone = '+05:30') {
    const diffInMins = moment()
      .utcOffset(timezone)
      .diff(moment(this.requestTimeStamp).utcOffset(timezone), 'minutes');
    if (diffInMins > 24 * 60 * 30 * 12) {
      return `${moment()
        .utcOffset(timezone)
        .diff(
          moment(this.requestTimeStamp).utcOffset(timezone),
          'years'
        )} year(s)`;
    } else if (diffInMins > 24 * 60 * 30) {
      return `${moment()
        .utcOffset(timezone)
        .diff(
          moment(this.requestTimeStamp).utcOffset(timezone),
          'months'
        )} month(s)`;
    } else if (diffInMins > 24 * 60) {
      return `${moment()
        .utcOffset(timezone)
        .diff(
          moment(this.requestTimeStamp).utcOffset(timezone),
          'days'
        )} day(s)`;
    } else if (diffInMins > 60) {
      return `${moment()
        .utcOffset(timezone)
        .diff(
          moment(this.requestTimeStamp).utcOffset(timezone),
          'hours'
        )} hour(s)`;
    } else if (diffInMins > 0) {
      return `${moment()
        .utcOffset(timezone)
        .diff(
          moment(this.requestTimeStamp).utcOffset(timezone),
          'minutes'
        )} min(s)`;
    } else {
      return;
    }
  }

  getColor(input, colorMap) {
    if (input.feedbackType === 'STAYFEEDBACK') {
      return colorMap.stayFeedbacks[input.message.overAllRating].colorCode;
    } else {
      return (
        input.feedbackType &&
        colorMap.transactionalFeedbacks[
          Object.keys(colorMap.transactionalFeedbacks).filter((key) => {
            const startValue = parseInt(
              colorMap.transactionalFeedbacks[key].scale[0]
            );
            const endValue = parseInt(
              colorMap.transactionalFeedbacks[key].scale.substring(
                2,
                colorMap.transactionalFeedbacks[key].scale.length
              )
            );
            const rating = parseInt(input.message.overAllRating);
            return rating >= startValue && rating <= endValue;
          })[0]
        ].colorCode
      );
    }
  }
}
