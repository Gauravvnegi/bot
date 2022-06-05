import { get, set } from 'lodash';
import { feedback } from '../constants/feedback';
import { Feedback, StayFeedback } from './feedback-datatable.model';

export class FeedbackList {
  records: FeedbackRecord[];

  deserialize(input, outlets, feedbackType, colorMap) {
    this.records = new Array<FeedbackRecord>();
    input?.records?.forEach((record) =>
      this.records.push(
        new FeedbackRecord().deserialize(
          record,
          outlets,
          feedbackType,
          colorMap
        )
      )
    );

    return this;
  }
}

export class FeedbackRecord {
  created: number;
  departmentLabel: string;
  departmentName: string;
  feedback;
  feedbackId: string;
  id: string;
  jobDuration: number;
  remarks;
  sla: number;
  status: string;
  timeOut: false;
  updated: number;
  userId: string;
  userName: string;

  deserialize(input, outlets, feedbackType, colorMap) {
    Object.assign(
      this,
      set({}, 'departmentLabel', get(input, ['departmentLabel'])),
      set({}, 'departmentName', get(input, ['departmentName'])),
      set({}, 'created', get(input, ['created'])),
      set({}, 'feedbackId', get(input, ['feedbackId'])),
      set({}, 'id', get(input, ['id'])),
      set({}, 'jobDuration', get(input, ['jobDuration'])),
      set({}, 'remarks', get(input, ['remarks'])),
      set({}, 'sla', get(input, ['sla'])),
      set({}, 'status', get(input, ['status'])),
      set({}, 'timeOut', get(input, ['timeOut'])),
      set({}, 'updated', get(input, ['updated'])),
      set({}, 'userId', get(input, ['userId'])),
      set({}, 'userName', get(input, ['userName']))
    );
    this.feedback =
      feedbackType === feedback.types.transactional
        ? new Feedback().deserialize(input.feedback, outlets)
        : new StayFeedback().deserialize(input.feedback, outlets, colorMap);
    return this;
  }

  getTableOrRoomNo(feedbackType) {
    return feedbackType === feedback.types.stay
      ? `RNO: ${this.feedback.tableOrRoomNumber}`
      : `TNO: ${this.feedback.bookingDetails.tableOrRoomNumber}`;
  }

  getProfileNickName() {
    const nameList = [
      this.feedback.guest.firstName,
      this.feedback.guest.lastName,
    ];
    return nameList
      .map((i, index) => {
        if ([0, 1].includes(index)) return i.charAt(0);
        else return '';
      })
      .join('')
      .toUpperCase();
  }
}
