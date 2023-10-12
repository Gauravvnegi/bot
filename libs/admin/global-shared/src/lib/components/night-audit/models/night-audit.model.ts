import { NightAuditResponse } from '../../../types/night-audit.type';
import {
  TableDataType,
  TableViewDataType,
} from '../../../types/table-view.type';
import { CheckoutPendingResponse } from '../types/checkout-pending.type';
import { LoggedInUsersResponse } from '../types/loggedin-users.type';
import { dateTimeWithFormat } from '../../../../../../../web-user/shared/src/lib/utils/date-utils';
import { CheckInResponseType } from '../types/checkin-pending.type';
/**
 * Table ViewData implement for the styling recommendation
 */
export class LoggedInUsers implements TableViewDataType {
  [key: string]: TableDataType;
  constructor(input: LoggedInUsersResponse) {
    this['name'] = input.firstName + input.lastName;
    this['department'] = input['department']; // TODO: Need to change, data not coming from api
    this['contact'] = {
      phoneNumber: input.phoneNumber,
      email: input.email,
    };
    this['jobTitle'] = input.title;
  }
}

export class CheckedOutReservation implements TableViewDataType {
  [key: string]: TableDataType;
  constructor(input: CheckoutPendingResponse) {
    const roomDetails = input.stayDetails.room;
    const primaryGuest = input.guestDetails.primaryGuest;
    const companyDetails = primaryGuest?.company;

    this['invoiceId'] = input?.invoiceCode || '';
    this['roomInfo'] = {
      icon: 'pi pi-users',
      styleClass: 'active-text',
      room: roomDetails.roomNumber + ' - ' + roomDetails.type,
    };
    this['bookingNo'] = '#' + input.number;
    this['stakeHolder'] = {
      guest: primaryGuest?.firstName + ' ' + primaryGuest?.firstName,
      company: primaryGuest?.company
        ? primaryGuest?.company.firstName + ' ' + primaryGuest?.company.lastName
        : '',
      postText: 'tiny-text',
    };
    this['visitStatus'] = dateTimeWithFormat(
      input.stayDetails.arrivalTime,
      'DD/MM/YYYY'
    );
    this['expenses'] = {
      dueAmount: input.paymentSummary.dueAmount,
      total: input.paymentSummary.totalAmount,
      preText: 'danger-text',
      textSeparator: '/',
      textInlineBlock: true,
    };

    // Map data
    this['sourceName'] = {
      source: '-',
      name: '--',
      postText: 'tiny-text',
    };

    this['dueAmount'] = input.paymentSummary.dueAmount;

    // Action
    this['action'] = {
      dropDown: {
        currentState: 'No Show',
        nextStates: ['No Show', 'Cancel'],
      },
      quick: [{ label: 'Edit Reservation', value: 'edit-reservation' }],
    };
  }
}

export class CheckedInReservation implements TableViewDataType {
  [key: string]: TableDataType;
  constructor(input: CheckInResponseType) {
    const roomDetails = input.stayDetails.room;
    const primaryGuest = input.guestDetails.primaryGuest;
    const companyDetails = primaryGuest?.company;

    this['invoiceId'] = input?.invoiceCode || '';
    this['roomInfo'] = {
      icon: 'pi pi-users',
      styleClass: 'active-text',
      room: roomDetails.roomNumber + ' - ' + roomDetails.type,
    };
    this['bookingNo'] = '#' + input.number;
    this['stakeHolder'] = {
      guest: primaryGuest?.firstName + ' ' + primaryGuest?.firstName,
      company: primaryGuest?.company
        ? primaryGuest?.company.firstName + ' ' + primaryGuest?.company.lastName
        : '',
      postText: 'tiny-text',
    };
    this['visitStatus'] = dateTimeWithFormat(
      input.stayDetails.arrivalTime,
      'DD/MM/YYYY'
    );
    this['expenses'] = {
      dueAmount: input.paymentSummary.dueAmount,
      total: input.paymentSummary.totalAmount,
      preText: 'danger-text',
      textSeparator: '/',
      textInlineBlock: true,
    };

    // Map data
    this['sourceName'] = {
      source: '-',
      name: '--',
      postText: 'tiny-text',
    };

    this['dueAmount'] = input.paymentSummary.dueAmount;

    // Action
    this['action'] = {
      dropDown: {
        currentState: 'No Show',
        nextStates: ['No Show', 'Cancel'],
      },
      quick: [{ label: 'Edit Reservation', value: 'edit-reservation' }],
    };
  }
}

export class NightAudit {
  loggedInUsers: LoggedInUsers[];
  checkedOutReservation: CheckedOutReservation[];
  checkedInReservation: CheckedInReservation[];
  //   auditSummary: AuditSummary[];
  deserialize(input: NightAuditResponse) {
    this.loggedInUsers = input.LoggedInUsers.map(
      (item) => new LoggedInUsers(item)
    );

    this.checkedInReservation = input.CheckInPending.map(
      (item) => new CheckedInReservation(item)
    );

    this.checkedOutReservation = input.CheckOutPending.map(
      (item) => new CheckedOutReservation(item)
    );

    return this;
  }
}
