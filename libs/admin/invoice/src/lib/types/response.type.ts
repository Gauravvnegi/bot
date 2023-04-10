
export type InvoiceResponse = {
    id: string,
    cashier: string,
    reservation: ReservationData;
    primaryGuest: PrimaryGuest;
    invoiceDate: number,
    itemList: Item[];
    originalAmount: number,
    invoicePaidAmount: number,
    invoiceDueAmount: number,
    invoiceAmount: number,
    roomNumber: number,
}

interface PrimaryGuest{
    id: string;
    firstName: string;
    lastName: string;
    contactDetails: Contact;
    age: number;
    documentRequired: boolean;
}

interface Contact{
    cc: string;
    contactNumber: string;
    emailId: string;
}

interface ReservationData{
    arrivalTime: number;
    departureTime: number;
    number: string;
    stateCompletedSteps: number;
    totalRoomCount: number;
    totalDueAmount: number;
    totalPaidAmount: number;
    totalAmount: number;
    invoicePrepareRequest: boolean;
    vip: boolean;
}

interface Item {
    id: string;
    discription: string;
    unit: number;
    unitValue: number;
    amount: number;
    itemTax: ItemTax[];
}

interface ItemTax{
    created: number;
    updated: number;
    id: string;
    country: string;
    taxType: string;
    taxValue: number;
    category: string;
    status: boolean;
}

