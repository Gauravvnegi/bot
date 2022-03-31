import { DateService } from '@hospitality-bot/shared/utils';
import { get, set } from 'lodash';
import {
  Booking,
  Feedback,
  Room,
  Status,
} from '../../../../dashboard/src/lib/data-models/reservation-table.model';

export class VisitDetails {
  records;

  deserialize(input, subscription) {
    this.records = new Array();
    input.forEach((item) => {
      if (item.type === 'INSTANT' && subscription)
        this.records.push(new VisitDetail().deserialize(item));
      else if (item.type === 'BOOKING')
        this.records.push(new Reservation().deserialize(item, subscription));
    });
    return this;
  }
}

export class Reservation {
  rooms: Room;
  feedback: Feedback;
  booking: Booking;
  visitDetail: VisitDetail;
  type: string;
  bookingType: string;
  deserialize(input: any, subscription) {
    this.rooms = new Room().deserialize(input.stayDetails);
    this.feedback = new Feedback().deserialize(input.feedback);
    this.booking = new Booking().deserialize(input);
    if (subscription)
      this.visitDetail = new VisitDetail().deserialize(input.visitDetails);
    this.type = input.type;
    this.bookingType = input.bookingType;
    return this;
  }

  getTitle() {
    switch (this.bookingType) {
      case 'UPCOMING':
        return 'Upcoming Booking';
      case 'PAST':
        return 'Past Booking';
      case 'CURRENT':
        return 'Current Booking';
    }
  }
}

export class VisitDetail {
  comment;
  feedbackId: string;
  feedbackSubmissionTime: number;
  feedbackType: string;
  intentToRecommends: string;
  marketSegment: string;
  outletId: string;
  serviceType: string;
  statusMessage: Status;
  surveyType: string;
  type: string;

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'comment', get(input, ['comment'])),
      set({}, 'feedbackId', get(input, ['feedbackId'])),
      set({}, 'feedbackSubmissionTime', get(input, ['feedbackSubmissionTime'])),
      set({}, 'feedbackType', get(input, ['feedbackType'])),
      set({}, 'intentToRecommends', get(input, ['intentToRecommends'])),
      set({}, 'marketSegment', get(input, ['marketSegment'])),
      set({}, 'outletId', get(input, ['outletId'])),
      set({}, 'serviceType', get(input, ['serviceType'])),
      set({}, 'surveyType', get(input, ['surveyType'])),
      set({}, 'statusMessage', get(input, ['statusMessage'])),
      set({}, 'type', get(input, ['type']))
    );
    return this;
  }

  getfeedbackSubmissionTime(timezone = '+05:30') {
    return DateService.getDateFromTimeStamp(
      this.feedbackSubmissionTime,
      'DD/M/YY',
      timezone
    );
  }
}
