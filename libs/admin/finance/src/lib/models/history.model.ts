export class InvoiceHistory {
  invoiceId: string;
  bookingNumber: string;
  rooms: number;
  invoiceDate: string;
  paymentMethods: string;
  status: string;
  totalBill: number;

  deserailize(input) {
    this.invoiceId = input.invoiceId;
    this.bookingNumber = input.bookingNumber;
    this.rooms = input.rooms;
    this.invoiceDate = input.invoiceDate;
    this.paymentMethods = input.paymentMethods;
    this.status = input.status;
    this.totalBill = input.totalBill;
    return this;
  }
}

export class TransactionHistory {
  transactionId: string;
  dateAndTime: string;
  status: string;
  paymentMethod: string;
  remarks: string;
  credit: number;
  balanceDue: string;

  deserialize(input) {
    this.transactionId = input.transactionId;
    this.dateAndTime = input.dateAndTime;
    this.status = input.status;
    this.paymentMethod = input.paymentMethod;
    this.remarks = input.remarks;
    this.credit = input.credit;
    this.balanceDue = input.balanceDue;
    return this;
  }
}
