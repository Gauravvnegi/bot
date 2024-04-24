import { NightAuditResponse } from '../../../types/night-audit.type';
import { ActionDataType, TableDataType } from '../../../types/table-view.type';
import { CheckoutPendingResponse } from '../types/checkout-pending.type';
import { CheckInResponseType } from '../types/checkin-pending.type';
import { quickActions } from '../constants/checked-in-reservation.table';
import { dateTimeWithFormat } from 'libs/admin/shared/src/lib/utils/date-utils';

/**
 * Table ViewData implement for the styling recommendation
 */

export class CheckedInReservation {
  id: string;
  invoiceId: TableDataType;
  bookingNo: TableDataType;
  roomInfo: TableDataType;
  stakeHolder: TableDataType;
  visitStatus: TableDataType;
  expenses: TableDataType;
  sourceName: TableDataType;
  action: ActionDataType;

  constructor(input: CheckInResponseType) {
    const roomDetails = input.bookingItems[0]?.roomDetails;
    const guest = input?.guest;
    this.id = input.id ?? '';
    this.invoiceId = input?.invoiceId ?? '';
    this.roomInfo = roomDetails?.roomNumber && {
      image: input.groupCode
        ? 'assets/images/group-booking.svg'
        : input.sessionType === 'DAY_BOOKING'
        ? 'assets/images/day-booking.svg'
        : '',
      styleClass: 'active-text',
      room: `${roomDetails.roomNumber + ' - ' + roomDetails.roomTypeLabel}`,
    };
    this.bookingNo = input?.reservationNumber && {
      postIcon: 'pi pi-copy',
      bookingNo: `${input?.reservationNumber ?? ''}`,
    };
    this.stakeHolder = {
      guest: guest?.firstName + ' ' + guest?.lastName,
      company: guest?.company
        ? guest?.company?.firstName ?? '' + ' ' + guest?.company?.lastName ?? ''
        : '',
      postText: 'tiny-text',
    };
    this.visitStatus = {
      fromTime: dateTimeWithFormat(input.from ?? 0, 'DD/MM/YYYY'),
      toTime: dateTimeWithFormat(input.to ?? 0, 'DD/MM/YYYY'),
      postText: 'tiny-text',
    };
    this.expenses = {
      dueAmount: `\u20B9 ${input?.pricingDetails?.totalDueAmount}` ?? 0,
      total: `\u20B9 ${input?.pricingDetails?.totalAmount}` ?? 0,
      preText: 'danger-text',
      textSeparator: '/',
      textInlineBlock: true,
    };

    // Map data
    this.sourceName = {
      source: input.source ?? '',
      name: input.sourceName ?? '',
      postText: 'tiny-text',
    };

    this.action = {
      dropDown: {
        currentState: input.reservationType,
        nextStates: [input.reservationType, ...input.nextStates],
      },
      quick: [{ label: 'Edit Reservation', value: 'edit-reservation' }],
    };
  }
}

export class CheckedOutReservation extends CheckedInReservation {
  constructor(input: CheckoutPendingResponse) {
    super(input as CheckInResponseType);
    // Action
    this.action = {
      dropDown: {
        ...this.action.dropDown,
        disabled: true,
      },
      quick: Object.entries(quickActions).map(([key, value]) => ({
        label: key.toUpperCase(),
        value: value,
      })),
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
