import { DateService } from '@hospitality-bot/shared/utils';
import { get, set, trim } from 'lodash';
import * as moment from 'moment';
import { feedback } from '../constants/feedback';

export interface Deserializable {
  deserialize(input: any): this;
}

export class FeedbackTable {
  total: number;
  entityTypeCounts;
  entityStateCounts: EntityStateCounts;
  records: Feedback[];

  deserialize(input, outlets) {
    Object.assign(this, set({}, 'total', get(input, ['total'])));
    this.entityStateCounts = new EntityStateCounts().deserialize(
      input.entityStateCounts
    );

    this.records = new Array<Feedback>();
    input.records.forEach((item) => {
      this.records.push(
        new Feedback().deserialize(
          item.feedback
            ? {
                ...item.feedback,
                status: item.status,
                departmentId: item.id,
                departmentLabel: item.departmentLabel,
                departmentName: item.departmentName,
                userId: item.userId,
                userName: item.userName,
                remarks: item.remarks,
                timeOut: item.timeOut,
                feedbackId: item.id,
              }
            : item,
          outlets
        )
      );
    });
    return this;
  }
}

export class Feedback {
  bookingDetails;
  comments: string;
  created: number;
  feedback;
  guestData: StayGuestData;
  guest: Guest;
  hotelId: string;
  id: string;
  outlet: string;
  ratings: number;
  read: boolean;
  serviceType: string;
  services: TransactionalService;
  session: string;
  tableNo: string;
  updated: number;
  notes: Notes;
  status: string;
  departmentId: string;
  departmentLabel: string;
  departmentName: string;
  userId: string;
  userName: string;
  remarks: Remark[];
  timeOut: boolean;
  feedbackId: string;
  deserialize(input, outlets) {
    this.remarks = new Array<Remark>();
    Object.assign(
      this,
      set({}, 'bookingDetails', JSON.parse(get(input, ['bookingDetails']))),
      set({}, 'comments', get(input, ['comments'])),
      set({}, 'created', get(input, ['created'])),
      set(
        {},
        'feedback',
        input.feedback ? JSON.parse(get(input, ['feedback'])) : {}
      ),
      set({}, 'hotelId', get(input, ['hotelId'])),
      set({}, 'id', get(input, ['id'])),
      set({}, 'ratings', get(input, ['ratings'])),
      set({}, 'read', get(input, ['read'])),
      set({}, 'serviceType', get(input, ['serviceType'])),
      set(
        {},
        'services',
        new TransactionalService().deserialize(
          JSON.parse(get(input, ['services'])),
          get(input, ['serviceMap'], [])
        )
      ),
      set({}, 'session', get(input, ['session'])),
      set({}, 'tableNo', get(input, ['tableNo'])),
      set({}, 'updated', get(input, ['updated'])),
      set({}, 'status', get(input, ['status'])),
      set({}, 'departmentId', get(input, ['departmentId'])),
      set({}, 'departmentLabel', get(input, ['departmentLabel'])),
      set({}, 'departmentName', get(input, ['departmentName'])),
      set({}, 'userId', get(input, ['userId'])),
      set({}, 'userName', get(input, ['userName'])),
      set({}, 'timeOut', get(input, ['timeOut'])),
      set({}, 'feedbackId', get(input, ['feedbackId'], ''))
    );
    this.outlet = outlets?.filter(
      (outlet) => outlet.id === input.entityId
    )[0]?.name;
    if (input.notes) this.notes = new Notes().deserialize(input.notes);
    if (input.remarks)
      input.remarks.forEach((item) =>
        this.remarks.push(new Remark().deserialize(item))
      );
    this.guest = new Guest().deserialize(input.guestId);
    this.guestData = new StayGuestData().deserialize(
      input.guestData || {
        arrivalTime: 0,
        churnProbalilty: 0,
        departureTime: 0,
        dueSpend: 0,
        guestCount: 0,
        overAllNps: 0,
        totalSpend: 0,
      }
    );
    return this;
  }

  getServiceTypeAndTime() {
    return `${this.bookingDetails['serviceType']}: ${this.bookingDetails['session']}`;
  }

  getCreatedDate(timezone = '+05:30') {
    return moment(this.created).utcOffset(timezone).format('DD/MM/YYYY');
  }

  getCreatedTime(timezone = '+05:30') {
    return moment(this.created).utcOffset(timezone).format('HH:mm');
  }

  getTableOrRoomNo(feedbackType) {
    return feedbackType === feedback.types.stay
      ? `RNO: ${this.bookingDetails.tableOrRoomNumber}`
      : `TNO: ${this.bookingDetails.tableOrRoomNumber}`;
  }

  getProfileNickName() {
    const nameList = [this.guest.firstName, this.guest.lastName];
    return nameList
      .map((i, index) => {
        if ([0, 1].includes(index)) return i.charAt(0);
        else return '';
      })
      .join('')
      .toUpperCase();
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

export class TransactionalService {
  services: Service[];
  rating;
  comment: string;
  staffName: string;

  deserialize(input, services) {
    this.services = new Array<Service>();
    Object.assign(
      this,
      set({}, 'comment', get(input, ['comment'])),
      set({}, 'staffName', get(input, ['staffName'])),
      set({}, 'rating', get(input, ['rating']))
    );
    services.forEach((service) =>
      this.services.push(new Service().deserialize(service))
    );
    return this;
  }

  getNegativeRatedService() {
    return this.services.filter((service) => service.rating === 'EI');
  }
}

export class Service {
  serviceName: string;
  rating;
  colorCode: string;
  comment: string;
  question: string;

  deserialize(input, colorMap?) {
    Object.assign(
      this,
      set({}, 'serviceName', get(input, 'serviceName')),
      set({}, 'rating', get(input, 'rating')),
      set({}, 'comment', get(input, 'comment')),
      set({}, 'question', get(input, 'question'))
    );
    if (colorMap) {
      if (isNaN(this.rating))
        this.colorCode =
          colorMap['transactionalFeedbacks'][this.rating].colorCode;
      else {
        this.colorCode = colorMap['stayFeedbacks'][this.rating].colorCode;
        this.rating = parseInt(this.rating);
      }
    }
    return this;
  }
}

export class StayService {
  label: string;
  value: number;
  category: string;
  key: string;

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'value', get(input, 'value')),
      set({}, 'category', get(input, 'category')),
      set({}, 'key', get(input, 'key')),
      set({}, 'label', get(input, ['label']).split('_').join(' '))
    );
    return this;
  }
}

export class Guest {
  anniversaryDate: string;
  countryCode: string;
  created: number;
  dateOfBirth: string;
  emailId: string;
  firstName: string;
  id: string;
  lastName: string;
  nameTitle: string;
  phoneNumber: string;
  place: string;
  spouseBirthDate: string;
  updated: number;
  fullName: string;
  deserialize(input) {
    Object.assign(
      this,
      set({}, 'anniversaryDate', get(input, ['anniversaryDate'])),
      set({}, 'countryCode', get(input, ['countryCode'], '')),
      set({}, 'created', get(input, ['created'], '')),
      set({}, 'dateOfBirth', get(input, ['dateOfBirth'], '')),
      set({}, 'emailId', get(input, ['emailId'], '')),
      set({}, 'firstName', get(input, ['firstName'], '')),
      set({}, 'id', get(input, ['id'], '')),
      set({}, 'lastName', get(input, ['lastName'], '')),
      set(
        {},
        'fullName',
        `${trim(get(input, ['firstName'], 'No'))} ${trim(
          get(input, ['lastName'], 'Name')
        )}`
      ),
      set({}, 'nameTitle', get(input, ['nameTitle'], '')),
      set({}, 'phoneNumber', get(input, ['phoneNumber'], '')),
      set({}, 'place', get(input, ['place'], '')),
      set({}, 'spouseBirthDate', get(input, ['spouseBirthDate'], '')),
      set({}, 'updated', get(input, ['updated'], ''))
    );
    return this;
  }

  getFullName() {
    return `${this.nameTitle ? this.nameTitle + ' ' : ''}${this.firstName} ${
      this.lastName
    }`;
  }

  getPhoneNumber() {
    return `${this.countryCode ? this.countryCode + ' ' : ''}${
      this.phoneNumber
    }`;
  }

  getCreatedDate(timezone = '+05:30') {
    return moment(this.created).utcOffset(timezone).format('DD/MM/YYYY');
  }
}

export class Notes {
  adminName: string;
  created: number;
  id: string;
  remarks: string;
  updated: number;

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'adminName', get(input, ['adminName'])),
      set({}, 'created', get(input, ['created'])),
      set({}, 'id', get(input, ['id'])),
      set({}, 'remarks', get(input, ['remarks'])),
      set({}, 'updated', get(input, ['updated']))
    );
    return this;
  }

  getUpdatedDate(timezone) {
    return moment(this.updated).utcOffset(timezone).format('DD/MM/YYYY');
  }

  getUpdatedTime(timezone) {
    return moment(this.updated).utcOffset(timezone).format('hh:mm A');
  }
}

export class StayFeedbackTable {
  total: number;
  entityTypeCounts;
  entityStateCounts: EntityStateCounts;
  records: StayFeedback[];

  deserialize(input, outlets, colorMap) {
    Object.assign(this, set({}, 'total', get(input, ['total'])));
    this.entityStateCounts = new EntityStateCounts().deserialize(
      input.entityStateCounts
    );
    this.records = new Array<StayFeedback>();
    input.records.forEach((item) => {
      this.records.push(
        new StayFeedback().deserialize(
          item.feedback
            ? {
                ...item.feedback,
                status: item.status,
                departmentId: item.id,
                departmentLabel: item.departmentLabel,
                departmentName: item.departmentName,
                userId: item.userId,
                userName: item.userName,
                remarks: item.remarks,
                timeOut: item.timeOut,
                feedbackId: item.id,
              }
            : item,
          outlets,
          colorMap
        )
      );
    });
    return this;
  }
}

export class StayFeedback {
  bookingDetails: any;
  comments: string;
  entityId: string;
  feedbackType: string;
  feedbackUrl: string;
  guestData: StayGuestData;
  guest: Guest;
  id: string;
  notes: Notes;
  ratings: number;
  read: boolean;
  serviceType: string;
  services: Service[];
  session: string;
  size: number;
  tableOrRoomNumber: string;
  transactionalService: string;
  outlet: string;
  status: string;
  commentList;
  created: number;
  updated: number;
  departmentId: string;
  departmentLabel: string;
  departmentName: string;
  userId: string;
  userName: string;
  remarks: Remark[];
  timeOut: boolean;
  deserialize(input, outlets, colorMap) {
    this.services = new Array<Service>();
    this.remarks = new Array<Remark>();
    this.commentList = {};
    Object.assign(
      this,
      set({}, 'bookingDetails', JSON.parse(get(input, ['bookingDetails']))),
      set({}, 'comments', get(input, ['comments'])),
      set({}, 'created', get(input, ['created'])),
      set({}, 'updated', get(input, ['updated'])),
      set({}, 'feedbackType', get(input, ['feedbackType'])),
      set({}, 'feedbackUrl', get(input, ['feedbackUrl'])),
      set({}, 'id', get(input, ['id'])),
      set({}, 'ratings', get(input, ['ratings'])),
      set({}, 'read', get(input, ['read'])),
      set({}, 'serviceType', get(input, ['serviceType'])),
      set({}, 'session', get(input, ['session'])),
      set({}, 'size', get(input, ['size'])),
      set({}, 'tableOrRoomNumber', get(input, ['tableOrRoomNumber'])),
      set({}, 'transactionalService', get(input, ['transactionalService'])),
      set({}, 'status', get(input, ['status'])),
      set({}, 'departmentId', get(input, ['departmentId'])),
      set({}, 'departmentLabel', get(input, ['departmentLabel'])),
      set({}, 'departmentName', get(input, ['departmentName'])),
      set({}, 'userId', get(input, ['userId'])),
      set({}, 'userName', get(input, ['userName'])),
      set({}, 'timeOut', get(input, ['timeOut'])),
      set({}, 'feedbackId', get(input, ['feedbackId'], ''))
    );
    const serviceList = get(input, ['serviceMap'], ['services']);
    serviceList?.forEach((item) =>
      this.services.push(new Service().deserialize(item, colorMap))
    );
    this.outlet = outlets?.filter(
      (outlet) => outlet.id === input.entityId
    )[0]?.name;
    if (input.notes) this.notes = new Notes().deserialize(input.notes);
    if (input.remarks)
      input.remarks.forEach((item) =>
        this.remarks.push(new Remark().deserialize(item))
      );
    this.guestData = new StayGuestData().deserialize(input.guestData);
    this.guest = new Guest().deserialize(input.guestId);
    return this;
  }

  getNegativeRatedService() {
    return this.getSortedServices().filter((service) =>
      isNaN(this.services[0]?.rating)
        ? service.rating === 'EI'
        : service.rating < 5
    );
  }

  getSortedServices() {
    const sortOrder = ['EI', 'ME', 'EE'];
    if (isNaN(this.services[0]?.rating))
      this.services.sort((a, b) => {
        if (a.rating === b.rating) {
          return a.rating?.localeCompare(b.rating);
        } else {
          return sortOrder?.indexOf(a.rating) - sortOrder.indexOf(b.rating);
        }
      });
    else this?.services.sort((a, b) => a.rating - b.rating);
    return this?.services;
  }

  getServiceComment(serviceName) {
    return this.commentList[serviceName.split(' ').join('_') + '_COMMENT'];
  }

  getCreatedDate(timezone = '+05:30') {
    return moment(this.created).utcOffset(timezone).format('DD/MM/YYYY');
  }

  getCreatedTime(timezone = '+05:30') {
    return moment(this.created).utcOffset(timezone).format('HH:mm');
  }

  getTableOrRoomNo(feedbackType) {
    return feedbackType === feedback.types.stay
      ? `RNO: ${this.bookingDetails.tableOrRoomNumber}`
      : `TNO: ${this.bookingDetails.tableOrRoomNumber}`;
  }

  getProfileNickName() {
    const nameList = [this.guest.firstName, this.guest.lastName];
    return nameList
      .map((i, index) => {
        if ([0, 1].includes(index)) return i.charAt(0);
        else return '';
      })
      .join('')
      .toUpperCase();
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

export class StayGuestData {
  arrivalTime: number;
  bookingNo: string;
  churnPrediction: string;
  churnProbalilty: number;
  departureTime: number;
  dueSpend: number;
  guestCount: number;
  overAllNps: number;
  totalSpend: number;
  transactionUsage: string;

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'arrivalTime', get(input, ['arrivalTime'])),
      set({}, 'bookingNo', get(input, ['bookingNo'])),
      set({}, 'churnPrediction', get(input, ['churnPrediction'])),
      set({}, 'churnProbalilty', get(input, ['churnProbalilty'])),
      set({}, 'departureTime', get(input, ['departureTime'])),
      set({}, 'dueSpend', get(input, ['dueSpend'])),
      set({}, 'guestCount', get(input, ['guestCount'])),
      set({}, 'overAllNps', get(input, ['overAllNps'])),
      set({}, 'totalSpend', get(input, ['totalSpend'])),
      set({}, 'transactionUsage', get(input, ['transactionUsage']))
    );
    return this;
  }

  getArrivalDate(timezone = '+05:30') {
    if (this.arrivalTime)
      return DateService.getDateFromTimeStamp(
        this.arrivalTime,
        'DD/M/YY',
        timezone
      );
    else return '';
  }

  getDepartureDate(timezone = '+05:30') {
    if (this.departureTime)
      return DateService.getDateFromTimeStamp(
        this.departureTime,
        'DD/M/YY',
        timezone
      );
    else return '';
  }

  getArrivalTime(timezone = '+05:30') {
    if (this.arrivalTime)
      return DateService.getDateFromTimeStamp(
        this.arrivalTime,
        'HH:mm',
        timezone
      );
    else return '';
  }

  getDepartureTime(timezone = '+05:30') {
    if (this.departureTime)
      return DateService.getDateFromTimeStamp(
        this.departureTime,
        'HH:mm',
        timezone
      );
    else return '';
  }
}

export class EntityStateCounts {
  ACTIONED: number;
  HIGHPOTENTIAL: number;
  HIGHRISK: number;
  READ: number;
  UNREAD: number;

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'ACTIONED', get(input, ['ACTIONED'])),
      set({}, 'HIGHPOTENTIAL', get(input, ['HIGHPOTENTIAL'])),
      set({}, 'HIGHRISK', get(input, ['HIGHRISK'])),
      set({}, 'READ', get(input, ['READ'])),
      set({}, 'UNREAD', get(input, ['UNREAD']))
    );
    return this;
  }
}

export class Remark {
  created: number;
  updated: number;
  adminName: string;
  remarks: string;

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'created', get(input, ['created'])),
      set({}, 'updated', get(input, ['updated'])),
      set({}, 'adminName', get(input, ['adminName'])),
      set({}, 'remarks', get(input, ['remarks']))
    );

    return this;
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

  getNickName() {
    return this.adminName
      .split(' ')
      .map((i, index) => {
        if ([0, 1].includes(index)) return i.charAt(0);
        else return '';
      })
      .join('')
      .toUpperCase();
  }
}
