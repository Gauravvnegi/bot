import { Cols } from '@hospitality-bot/admin/shared';
import { cols } from '../constants/audit-summary.table';
import {
  AuditSummaryResponse,
  AuditViewType,
} from '../types/audit-summary.type';
import { TableObjectData } from '../../../types/table-view.type';
export class AuditSummary {
  records: AuditViewType;

  initColumns(input: AuditSummaryResponse) {
    const dynamicCols: Cols[] = [
      ...input.outlets.map((item) => ({
        field: Object.keys(item).shift(),
        header: getTitleCaseString(Object.keys(item).shift()),
      })),
    ];
    cols['revenueList'] = [...cols['revenueList'], ...dynamicCols];
    return dynamicCols;
  }

  getCashierDetails(input: AuditSummaryResponse) {
    let totalAmount = 0;
    let cashierDetail = Object.keys(input.cashiersPayment).map((key) => {
      totalAmount = totalAmount + +input.cashiersPayment[key];
      return {
        counter: getTitleCaseString(key),
        revenueReceived: `Rs. ${input.cashiersPayment[key]}`,
        withdrawals: '',
        balance: '',
      };
    });
    cashierDetail.push({
      counter: 'Total',
      revenueReceived: ' ',
      withdrawals: ' ',
      balance: `Rs. ${totalAmount}`,
    });
    return cashierDetail;
  }

  getRevenueList(input: AuditSummaryResponse, dynamicCols: Cols[]) {
    let total = 0;
    let revenueList: TableObjectData[] = [
      dynamicCols.reduce(
        (pre, curr, index) => {
          total = total + +input.outlets[index].totalAmount;
          return { ...pre, [curr.field]: input.outlets[index].totalAmount };
        },
        {
          booking: `Rs. ${input?.bookingAmount}`,
          cancellation: '',
          noShows: '',
          restaurant: '',
        }
      ),
    ];

    revenueList.push({
      textInlineBlock: true,
      booking: 'Total Revenue',
      cancellation: '',
      noShows: '',
      restaurant: '',
      miniBar: '',
      confectionary: '',
      bookStore: '',
      iceCreamStore: `Rs. ${total}`,
    });
    return revenueList;
  }

  deserialize(input: AuditSummaryResponse) {
    const dynamicCols = this.initColumns(input);
    const cashierDetail = this.getCashierDetails(input);

    const getStatusCount = (key: string) => {
      return input.roomStatusMap.find((item) => item.status == key)?.count;
    };
    let accountDetails = {
      DIRTY: getStatusCount('DIRTY'),
      INSPECTED: getStatusCount('INSPECTED'),
      CLEAN: getStatusCount('CLEAN'),
    };

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
        values: cashierDetail,
      },
      revenueList: {
        title: 'Revenue List',
        values: this.getRevenueList(input, dynamicCols),
      },
    };
    return this;
  }
}

const getTitleCaseString = (str: string) => {
  const transformedStr = str.replace(/([A-Z])/g, ' $1');
  return (
    transformedStr.charAt(0).toUpperCase() + transformedStr.slice(1).trim()
  );
};
