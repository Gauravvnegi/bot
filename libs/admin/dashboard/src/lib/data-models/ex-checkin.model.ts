export class PreArrivalRequestList {
  PreArrivalRequest: PreArrivalRequest[];

  deserialize(input) {
    this.PreArrivalRequest = input.records.map((data) =>
      new PreArrivalRequest().deserialize(data)
    );
    return this;
  }
}

export class PreArrivalRequest {
  itemName: string;
  bookingNo: number;
  customerName: string;
  description: string;
  time;

  deserialize(input) {
    this.itemName = input.itemName;
    this.bookingNo = input.confirmationNumber;

    this.customerName =
      input.guestDetails.primaryGuest.firstName +
      ' ' +
      input.guestDetails.primaryGuest.lastName;
    this.time = input.stayDetails.arrivalTime;
    return this;
  }
}
