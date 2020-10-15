import { FieldSchema } from './fieldSchema.model';
import { get, set } from 'lodash';
import { DateService } from '../../../../../shared/utils/src/lib/date.service';

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
      this.billSummary =  new PaymentSummaryDetail().deserialize(paymentData);
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
  
    deserialize(reservation:any, rooms: any, stayDetails, primaryGuest) {
      Object.assign(
        this,
        set({}, 'bookingNumber', get(reservation, ['number'])),
        set({}, 'unit', get(rooms, ['unit'])),
        set({}, 'roomType', get(rooms, ['type'])),
        set({}, 'roomNumber', get(rooms, ['roomNumber'])),
        set({}, 'adultsCount', get(stayDetails, ['adultsCount'])),
        set({}, 'kidsCount', get(stayDetails, ['kidsCount'])),
        set({}, 'arrivalDate', new DateService().convertTimestampToDate(get(stayDetails, ['arrivalTime']),'DD-MM-YYYY')),
        set({}, 'departureDate', new DateService().convertTimestampToDate(get(stayDetails, ['departureTime']),'DD-MM-YYYY')),
        set({}, 'currentDate', new DateService().currentDate()),
        set({}, 'firstname', get(primaryGuest, ['firstName'])),
        set({}, 'lastname', get(primaryGuest, ['lastName'])),
      );
      return this;
    }
  }

  // export class PaymentSummaryDetail implements Deserializable {
  
  //   subtotal: number;
  //   tax: number;
  //   unit: number;
  //   baseRate: number;
  //   totalRate: number;
  //   paidAmount: number;
  //   totalAmount: number;
  //   currencyCode: string;

  //   deserialize(rooms: any, billDetails: any) {
  //     /**
  //      * indexes are hardcoded as data from PMS is still not clear 
  //      * structure needs to be modified once PMS data queries are answered
  //      */
  //     let subtotal;
  //     let baseRate;
  //     if(billDetails.dailyBreakdown.length > 0 && billDetails.dailyBreakdown[0].roomRatesAndPackage.length > 0){
  //       subtotal = rooms.unit *billDetails.dailyBreakdown[0].roomRatesAndPackage[0].amount.value;
  //       baseRate = billDetails.dailyBreakdown[0].roomRatesAndPackage[0].amount.value;
  //     }
  //     Object.assign(
  //       this,
  //       set({}, 'currencyCode', get(billDetails.grossTotal, ['currencyCode'])),
  //       set({}, 'unit', get(rooms, ['unit'])),
  //       set({}, 'baseRate', baseRate),
  //       set({}, 'totalRate', subtotal),
  //       set({}, 'tax', get(billDetails.totalTax, ['value'])),
  //       set({}, 'paidAmount', get(billDetails.paidAmount, ['value'])),
  //       set({}, 'totalAmount', get(billDetails.grossTotal, ['value'])),
       
  //     );
  //     return this;
  //   }
  // }

  export class PaymentSummaryDetail implements Deserializable {
    currency;
    dueAmount;
    paidAmount;
    subtotal;
    taxAmount;
    totalAmount;
    totalDiscount;
    roomRates;
    packages = new Array<PackageDetails>();
    deserialize(input: any) {
      Object.assign(
        this,
        set({}, 'currency', get(input, ['currency'])),
        set({}, 'dueAmount', get(input, ['dueAmount'])),
        set({}, 'paidAmount', get(input, ['paidAmount'])),
        set({}, 'subtotal', get(input, ['subtotal'])),
        set({}, 'taxAmount', get(input, ['taxAmount'])),
        set({}, 'totalAmount', get(input, ['totalAmount'])),
        set({}, 'totalDiscount', get(input, ['totalDiscount']))
      );
      this.roomRates = new RoomRateDetails().deserialize(input.roomRates);
      input.packages.forEach(amenity => {
        this.packages.push(new PackageDetails().deserialize(amenity));
      });
      
      return this;
    }
  }

  export class RoomRateDetails implements Deserializable {
    amount;
    unitPrice;
    description;
    discount;
    totalAmount;
    unit;
    label;
    taxAndFees;
  
    deserialize(input: any) {
      Object.assign(
        this,
        set({}, 'amount', get(input, ['amount'])),
        set({}, 'unitPrice', get(input, ['base'])),
        set({}, 'description', get(input, ['description'])),
        set({}, 'discount', get(input, ['discount'])),
        set({}, 'totalAmount', get(input, ['totalAmount'])),
        set({}, 'label', get(input, ['label'])),
        set({}, 'taxAndFees', get(input, ['taxAndFees'])),
        set({}, 'unit', get(input, ['unit']))
      );
      return this;
    }
  }

  export class PackageDetails implements Deserializable {
    amount;
    unitPrice;
    description;
    discount;
    totalAmount;
    unit;
    label;
    taxAndFees;
  
    deserialize(input: any) {
      Object.assign(
        this,
        set({}, 'amount', get(input, ['amount'])),
        set({}, 'unitPrice', get(input, ['base'])),
        set({}, 'description', get(input, ['description'])),
        set({}, 'discount', get(input, ['discount'])),
        set({}, 'totalAmount', get(input, ['totalAmount'])),
        set({}, 'label', get(input, ['label'])),
        set({}, 'taxAndFees', get(input, ['taxAndFees'])),
        set({}, 'unit', get(input, ['unit']))
      );
      return this;
    }
  }

export interface SummaryDetailsConfigI {
    request: FieldSchema;
}