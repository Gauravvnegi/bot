import { DateService } from '@hospitality-bot/shared/utils';
import { get, set } from 'lodash';
import {
  Booking,
  Feedback,
  Room,
  Status,
} from '../../../../dashboard/src/lib/data-models/reservation-table.model';

export class GuestDetails {
  records: GuestDetail[];

  deserialize(input) {
    this.records = new Array();
    input.forEach((item) => {
      this.records.push(new GuestDetail().deserialize(item));
    });
    return this;
  }
}

export class GuestDetail {
  reservation: Reservation;
  feedback: VisitDetail;
  type: string;
  subType: string;

  deserialize(input) {
    if (input.guestReservation) {
      this.reservation = new Reservation().deserialize(
        input.guestReservation,
        input.subType
      );
    }
    if (input.feedback)
      this.feedback = new VisitDetail().deserialize(input.feedback);
    Object.assign(
      this,
      set({}, 'type', get(input, ['type'])),
      set({}, 'subType', get(input, ['subType']))
    );

    return this;
  }
}

export class Reservation {
  rooms: Room;
  feedback: Feedback;
  booking: Booking;
  visitDetail: VisitDetail;
  type: string;
  deserialize(input: any, type: string) {
    this.rooms = new Room().deserialize(input.stayDetails);
    // this.feedback = new Feedback().deserialize(input.feedback);
    this.booking = new Booking().deserialize(input);
    this.visitDetail = new VisitDetail().deserialize(input.feedback);
    this.type = type;
    return this;
  }

  getTitle() {
    switch (this.type) {
      case 'UPCOMING':
        return 'Upcoming Booking';
      case 'PAST':
        return 'Past Booking';
      case 'PRESENT':
        return 'Current Booking';
    }
  }
}

export class VisitDetail {
  comment;
  feedbackId: string;
  feedbackSubmissionTime: number;
  feedbackType: string;
  intentToRecommends;
  marketSegment: string;
  outletId: string;
  serviceType: string;
  statusMessage;
  surveyType: string;

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'comment', get(input, ['comments'])),
      set({}, 'feedbackId', get(input, ['feedbackId'])),
      set({}, 'feedbackSubmissionTime', get(input, ['feedbackSubmissionTime'])),
      set({}, 'feedbackType', get(input, ['feedbackType'])),
      set({}, 'intentToRecommends', get(input, ['intentToRecommends'])),
      set({}, 'marketSegment', get(input, ['marketSegment'])),
      set({}, 'outletId', get(input, ['outletId'])),
      set({}, 'serviceType', get(input, ['serviceType'])),
      set({}, 'surveyType', get(input, ['surveyType'])),
      set({}, 'statusMessage', get(input, ['statusMessage']))
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
