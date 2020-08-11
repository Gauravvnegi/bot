import { FieldSchema } from './fieldSchema.model';
import { get, set } from 'lodash';

export interface Deserializable {
    deserialize(reservation: any, rooms: any,stayDetails:any, primaryGuest): this;
}

  export class BillSummaryDetailDS implements Deserializable {
    staySummary: StaySummaryDetail;
    billSummary: PaymentSummaryDetail;
  
    deserialize(input: any, paymentData:any) {
      //Rooms index is hardcoded as we are not sure about the api response , it should either be not an array or the whole api response should be changed
      // It is submitted as query as this data comes from PMS . once api response is confirmed , structure would be changed
      this.staySummary = new StaySummaryDetail().deserialize(input, input.rooms[0], input.stayDetails, input.guestDetails.primaryGuest);
      this.billSummary =  new PaymentSummaryDetail().deserialize(input.rooms[0],paymentData);
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
    billedGuestFirstname: string;
    billedGuestLastname: string;
  
    deserialize(reservation:any, rooms: any, stayDetails, primaryGuest) {
      Object.assign(
        this,
        set({}, 'bookingNumber', get(reservation, ['number'])),
        set({}, 'unit', get(rooms, ['unit'])),
        set({}, 'roomType', get(rooms, ['type'])),
        set({}, 'roomNumber', get(rooms, ['roomNumber'])),
        set({}, 'adultsCount', get(stayDetails, ['adultsCount'])),
        set({}, 'kidsCount', get(stayDetails, ['kidsCount'])),
        set({}, 'arrivalDate', get(stayDetails, ['arrivalTime'])),
        set({}, 'departureDate', get(stayDetails, ['departureTime'])),
        set({}, 'billedGuestFirstname', get(primaryGuest, ['firstName'])),
        set({}, 'billedGuestLastname', get(primaryGuest, ['lastName'])),
      );
      return this;
    }
  }

  export class PaymentSummaryDetail implements Deserializable {
  
    subtotal: number;
    tax: number;
    unit: number;
    baseRate: number;
    totalRate: number;
    paidAmount: number;
    totalAmount: number;
    currencyCode: string;

    deserialize(rooms: any, billDetails: any) {
      /**
       * indexes are hardcoded as data from PMS is still not clear 
       * structure needs to be modified once PMS data queries are answered
       */
      let subtotal;
      let baseRate;
      if(billDetails.dailyBreakdown.length > 0 && billDetails.dailyBreakdown[0].roomRatesAndPackage.length > 0){
        subtotal = rooms.unit *billDetails.dailyBreakdown[0].roomRatesAndPackage[0].amount.value;
        baseRate = billDetails.dailyBreakdown[0].roomRatesAndPackage[0].amount.value;
      }
      Object.assign(
        this,
        set({}, 'currencyCode', get(billDetails.grossTotal, ['currencyCode'])),
        set({}, 'unit', get(rooms, ['unit'])),
        set({}, 'baseRate', baseRate),
        set({}, 'totalRate', subtotal),
        set({}, 'tax', get(billDetails.totalTax, ['value'])),
        set({}, 'paidAmount', get(billDetails.paidAmount, ['value'])),
        set({}, 'totalAmount', get(billDetails.grossTotal, ['value'])),
       
      );
      return this;
    }
  }

export interface SummaryDetailsConfigI {
    request: FieldSchema;
}