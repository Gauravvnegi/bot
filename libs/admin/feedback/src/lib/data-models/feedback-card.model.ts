import { get, set } from 'lodash';
import * as moment from 'moment';
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

  getSLA() {
    if (this.sla)
      return `${Math.round(((this.sla % 86400000) % 3600000) / 60000)}m`;
    else '------';
  }

  getStatus(array) {
    return array.filter((item) => item.value === this.status)[0]?.label;
  }

  getTime(timezone = '+05:30') {
    const diff = moment()
      .utcOffset(timezone)
      .diff(moment(+this.updated).utcOffset(timezone), 'days');
    const currentDay = moment().format('DD');
    const lastMessageDay = moment
      .unix(+this.updated / 1000)
      .utcOffset(timezone)
      .format('DD');
    if (diff > 0) {
      return moment(this.updated).utcOffset(timezone).format('DD MMM');
    } else if (+diff === 0 && +currentDay > +lastMessageDay) {
      return 'Yesterday';
    }
    return moment(this.updated).utcOffset(timezone).format('h:mm a');
  }
}
