import { PaymentField } from "../types/forms.types";
import { InvoiceResponse } from "../types/response.type";

export class Invoice{
    cashierName: string;
    invoiceDate: number;
    arrivalDate: number;
    guestName: string;
    departureDate: number;
    tableData: PaymentField[];
    currentAmount: number;
    paidAmount: number;
    paidValue: number;
    dueAmount: number;
    discountedAmount: number; 
    totalDiscount: number;
    roomNumber: number;

    deserialize(input: InvoiceResponse){
        this.cashierName = input.cashier;
        this.invoiceDate = input.invoiceDate;
        this.guestName = input.primaryGuest.firstName;
          // Deserialize tableData
        this.arrivalDate = input.reservation.arrivalTime;
        this.departureDate = input.reservation.departureTime;
        this.tableData = input.itemList.map(item => ({
          description: item.discription,
          unitValue: item.unitValue,
          unit: item.unit,
          amount: item.amount,
          tax: item.itemTax.map(item=>item.taxType),
          totalAmount: item.amount,
        }));    
        this.currentAmount = input.invoiceAmount;
        this.paidAmount = input.invoicePaidAmount;
        this.paidValue = input.invoicePaidAmount;
        this.totalDiscount = input.originalAmount;
        this.dueAmount = input.invoiceDueAmount;
        this.discountedAmount = input.invoiceAmount;
        this.roomNumber = input.roomNumber;
        return this;
    }
}
