import {
  AuditSummaryResponse,
  AuditViewType,
} from '../types/audit-summary.type';
export class AuditSummary {
  records: AuditViewType;
  deserialize(input: AuditSummaryResponse) {
    const getStatusCount = (key: string) => {
      return input.roomStatusMap.find((item) => item.status == key)?.count;
    };
    let accountDetails = {
      DIRTY: getStatusCount('DIRTY'),
      INSPECTED: getStatusCount('INSPECTED'),
      CLEAN: getStatusCount('CLEAN'),
    };
    const totalBooking =
      input.roomRevenue + input.roomSgstPerDay + input.roomCgstPerDay;

    this.records = {
      rooms: {
        title: 'Room Details',
        values: [
          {
            occupiedRooms: input.occupiedRooms,
            availableRooms: input.totalRooms - input.occupiedRooms,
            checkIns: input.arrivalRooms,
            checkOuts: input.departureRooms,
            noShows: input.noShowRooms,
            cancellations: input.cancelledReservationForToday,
          },
        ],
      },
      houseKeeping: {
        title: 'Housekeeping Details',
        values: [
          {
            clean: accountDetails?.CLEAN,
            dirty: accountDetails?.DIRTY,
            inspected: accountDetails?.INSPECTED,
          },
        ],
      },
      accountDetails: {
        title: 'Account Details',
        values: [
          {
            counter: 'Room Service', // Hard Coded
            revenueReceived: `Rs. ${input.roomRevenue}`,
            withdrawals: '',
            balance: '',
          },
          {
            counter: 'Total',
            revenueReceived: ' ',
            withdrawals: ' ',
            balance: `Rs. ${input.roomRevenue}`,
          },
        ],
      },
      revenueList: {
        title: 'Revenue List',
        values: [
          {
            booking: `Rs. ${totalBooking}`,
            cancellation: '',
            noShows: '',
            restaurant: '',
            miniBar: '',
            confectionary: '',
            bookStore: '',
            iceCreamStore: '',
          },
          {
            textInlineBlock: true,
            booking: 'Total Revenue',
            cancellation: '',
            noShows: '',
            restaurant: '',
            miniBar: '',
            confectionary: '',
            bookStore: '',
            iceCreamStore: `Rs. ${totalBooking}`,
          },
        ],
      },
    };
    return this;
  }
}
