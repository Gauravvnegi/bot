import { FieldSchema } from './fieldSchema.model';
import { get, set } from 'lodash';
import { DateService } from '../../../../../shared/utils/src/lib/date.service';

export interface Deserializable {
  deserialize(
    reservation: any,
    rooms: any,
    stayDetails: any,
    primaryGuest
  ): this;
}

export class BillSummaryDetailDS implements Deserializable {
  staySummary: StaySummaryDetail;
  billSummary: PaymentSummaryDetail;

  deserialize(input: any, paymentData: any) {
    //Rooms index is hardcoded as we are not sure about the api response , it should either be not an array or the whole api response should be changed
    // It is submitted as query as this data comes from PMS . once api response is confirmed , structure would be changed
    if (input.rooms && paymentData) {
      this.staySummary = new StaySummaryDetail().deserialize(
        input,
        input.rooms[0],
        input.stayDetails,
        input.guestDetails.primaryGuest
      );
      this.billSummary = new PaymentSummaryDetail().deserialize(paymentData);
    }
    return this;
  }
}

export class StaySummaryDetail implements Deserializable {
  roomNumber: number;
  unit: number;
  roomType: string;
  adultsCount: number;
  kidsCount: number;
  bookingNumber: string;
  arrivalDate: string;
  departureDate: string;
  currentDate: string;
  firstname: string;
  lastname: string;

  deserialize(reservation: any, rooms: any, stayDetails, primaryGuest) {
    Object.assign(
      this,
      set({}, 'bookingNumber', get(reservation, ['number'])),
      set({}, 'unit', get(rooms, ['unit'])),
      set({}, 'roomType', get(rooms, ['type'])),
      set({}, 'roomNumber', get(rooms, ['roomNumber'])),
      set({}, 'adultsCount', get(stayDetails, ['adultsCount'])),
      set({}, 'kidsCount', get(stayDetails, ['kidsCount'])),
      set(
        {},
        'arrivalDate',
        DateService.convertTimestampToDate(
          get(stayDetails, ['arrivalTime']),
          'DD-MM-YYYY'
        )
      ),
      set(
        {},
        'departureDate',
        DateService.convertTimestampToDate(
          get(stayDetails, ['departureTime']),
          'DD-MM-YYYY'
        )
      ),
      set({}, 'currentDate', DateService.currentDate()),
      set({}, 'firstname', get(primaryGuest, ['firstName'])),
      set({}, 'lastname', get(primaryGuest, ['lastName']))
    );
    return this;
  }
}

export class PaymentSummaryDetail implements Deserializable {
  currency;
  dueAmount;
  paidAmount;
  totalAmount;
  signatureUrl;
  billItems: BillItem[];
  deserialize(input: any) {
    this.billItems = new Array<BillItem>();
    Object.assign(
      this,
      set({}, 'currency', get(input, ['currency'])),
      set({}, 'dueAmount', get(input, ['totalDueAmount'])),
      set({}, 'totalAmount', get(input, ['totalAmount'])),
      set({}, 'paidAmount', get(input, ['totalPaidAmount'])),
      set({}, 'signatureUrl', get(input, ['signatureUrl']))
    );
    input.billItems.forEach((item) => {
      this.billItems.push(new BillItem().deserialize(item));
    });
    return this;
  }
}

export class BillItem {
  creditAmount: number;
  currency: string;
  date: number;
  debitAmount: number;
  description: string;
  unit: number;

  deserialize(input) {
    Object.assign(
      this,
      set(
        {},
        'date',
        DateService.convertTimestampToDate(get(input, ['date']), 'DD-MM-YYYY')
      ),
      set({}, 'creditAmount', get(input, ['creditAmount'])),
      set({}, 'currency', get(input, ['currency'])),
      set({}, 'debitAmount', get(input, ['debitAmount'])),
      set({}, 'description', get(input, ['description'])),
      set({}, 'unit', get(input, ['unit'])),
    );
    return this;
  }
}

export interface SummaryDetailsConfigI {
  request: FieldSchema;
}
