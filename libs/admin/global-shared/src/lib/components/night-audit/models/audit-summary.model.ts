import { Cols } from '@hospitality-bot/admin/shared';
import {
  AuditSummaryColumn,
  AuditSummaryResponse,
  AuditViewType,
} from '../types/audit-summary.type';
import { TableObjectData } from '../../../types/table-view.type';
export class AuditSummary {
  columns: Record<AuditSummaryColumn, Cols[]> | {};
  records: AuditViewType;

  deserialize(input: AuditSummaryResponse) {
    this.columns = input?.outlets
      ? { revenueList: this.initColumns(input) }
      : {};
    const cashierDetail = this.getCashierDetails(input);
    const revenueDetail = this.getRevenueList(
      input,
      this.columns['revenueList']
    );
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
            occupiedRooms: input?.occupiedRooms ?? 0,
            availableRooms: input?.totalRooms - input?.occupiedRooms ?? 0,
            checkIns: input?.arrivalRooms ?? 0,
            checkOuts: input?.departureRooms ?? 0,
            noShows: input?.noShowRooms ?? 0,
            cancellations: input?.cancelledReservationForToday ?? 0,
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
        values: [...cashierDetail],
      },
      revenueList: {
        title: 'Revenue List',
        values: [...revenueDetail],
      },
    };
    return this;
  }

  initColumns(input: AuditSummaryResponse) {
    const dynamicCols: Cols[] = [
      ...input.outlets.map((item) => ({
        field: item.id,
        header: getTitleCaseString(item.name),
      })),
    ];
    return dynamicCols;
  }

  getCashierDetails(input: AuditSummaryResponse) {
    let totalAmount = 0;
    let cashierDetail = Object.keys(input.cashiersPayment).map((key) => {
      totalAmount = totalAmount + +input.cashiersPayment[key];
      return {
        counter: getTitleCaseString(key),
        revenueReceived: `\u20B9 ${input.cashiersPayment[key]}`,
        withdrawals: '',
        balance: '',
      };
    });
    if (cashierDetail.length)
      cashierDetail.push({
        counter: 'Total',
        revenueReceived: ' ',
        withdrawals: ' ',
        balance: `\u20B9 ${totalAmount}`,
      });
    return cashierDetail;
  }

  getRevenueList(input: AuditSummaryResponse, dynamicCols: Cols[]) {
    //to calculate total revenue amount
    let total =
      input?.bookingAmount +
      input?.canceledReservationAmount +
      input?.noShowReservationAmount;

    let revenueList: TableObjectData[] = [
      dynamicCols.reduce(
        (pre, curr, index) => {
          total = total + +input.outlets[index].totalAmount;
          return {
            ...pre,
            [curr.field]: `\u20B9 ${input.outlets[index].totalAmount}`,
          };
        },
        {
          booking: `\u20B9 ${input?.bookingAmount}`,
          cancellation: `\u20B9 ${input?.canceledReservationAmount}`,
          noShows: `\u20B9 ${input?.noShowReservationAmount}`,
        }
      ),
    ];

    //for total revenue rows
    if (revenueList.length) {
      const revenueListKeys = Object.keys(revenueList[0]);
      let totalInfo = { textInlineBlock: true };
      revenueListKeys.forEach((key, index) => {
        if (index == 0) {
          totalInfo = { ...totalInfo, [key]: 'Total Revenue' };
        } else if (index == revenueListKeys.length - 1) {
          totalInfo = { ...totalInfo, [key]: `\u20B9 ${total}` };
        } else {
          totalInfo = { ...totalInfo, [key]: ' ' };
        }
      });
      revenueList.push(totalInfo);
    }
    return revenueList;
  }
}

const getTitleCaseString = (str: string) => {
  const transformedStr = str.replace(/([A-Z])/g, ' $1');
  return (
    transformedStr.charAt(0).toUpperCase() + transformedStr.slice(1).trim()
  );
};
