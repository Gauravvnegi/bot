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
        revenueReceived: `Rs. ${input.cashiersPayment[key]}`,
        withdrawals: '',
        balance: '',
      };
    });
    if (cashierDetail.length)
      cashierDetail.push({
        counter: 'Total',
        revenueReceived: ' ',
        withdrawals: ' ',
        balance: `Rs. ${totalAmount}`,
      });
    return cashierDetail;
  }

  getRevenueList(input: AuditSummaryResponse, dynamicCols: Cols[]) {
    let total = input?.bookingAmount;
    let revenueList: TableObjectData[] = [
      dynamicCols.reduce(
        (pre, curr, index) => {
          total = total + +input.outlets[index].totalAmount;
          return {
            ...pre,
            [curr.field]: `Rs. ${input.outlets[index].totalAmount}`,
          };
        },
        {
          booking: `Rs. ${input?.bookingAmount}`,
          cancellation: '',
          noShows: '',
          restaurant: '',
        }
      ),
    ];

    if (revenueList.length) {
      const revenueListKeys = Object.keys(revenueList[0]);
      let totalInfo = { textInlineBlock: true };
      revenueListKeys.forEach((key, index) => {
        if (index == 0) {
          totalInfo = { ...totalInfo, [key]: 'Total Revenue' };
        } else if (index == revenueListKeys.length - 1) {
          totalInfo = { ...totalInfo, [key]: `Rs. ${total}` };
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
