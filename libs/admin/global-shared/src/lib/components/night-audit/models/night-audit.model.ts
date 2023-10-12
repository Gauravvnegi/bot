import { NightAuditResponse } from '../../../types/night-audit.type';
import {
  TableDataType,
  TableViewDataType,
} from '../../../types/table-view.type';
import { CheckoutPendingResponse } from '../types/checkout-pending.type';
import { dateTimeWithFormat } from '../../../../../../../web-user/shared/src/lib/utils/date-utils';
import { CheckInResponseType } from '../types/checkin-pending.type';
import { User } from 'libs/admin/roles-and-permissions/src/lib/models/user-permission-table.model';
/**
 * Table ViewData implement for the styling recommendation
 */
export class LoggedInUsers implements TableViewDataType {
  [key: string]: TableDataType;
  constructor(input: User) {
    this['name'] = input.firstName + input.lastName;
    this['department'] = input['department']; // TODO: Need to change, data not coming from api
    this['contact'] = {
      phoneNumber: input.phoneNumber,
      email: input.email,
    };
    this['jobTitle'] = input.jobTitle;
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
      source: input.source,
      name: input.sourceName,
      postText: 'tiny-text',
    };

    // Action
    this['action'] = {
      dropDown: {
        currentState: 'Confirmed',
        nextStates: ['Confirmed'],
        disabled: true,
      },
      quick: [
        { label: 'Modify', value: 'modify' },
        { label: 'Settlement', value: 'settlement' },
      ],
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
      source: input.source,
      name: input.sourceName,
      postText: 'tiny-text',
    };

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
  checkedOutReservation: CheckedOutReservation[];
  checkedInReservation: CheckedInReservation[];
  //   auditSummary: AuditSummary[];
  deserialize(input: NightAuditResponse) {
    this.checkedInReservation = input.CheckInPending.map(
      (item) => new CheckedInReservation(item)
    );

    this.checkedOutReservation = input.CheckOutPending.map(
      (item) => new CheckedOutReservation(item)
    );

    return this;
  }
}
