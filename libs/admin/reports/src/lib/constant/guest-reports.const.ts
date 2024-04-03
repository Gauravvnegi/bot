import { GuestTypeReport } from '../models/guest-reports.model';
import {
  GuestComplaintReportData,
  GuestContactReportData,
  GuestEscalationComplaintReportData,
  GuestHistoryData,
  GuestLedgerData,
  GuestTypeReportData,
  SalesByGuestData,
} from '../types/guest-reports.types';
import { ColsData } from '../types/reports.types';

export const guestComplaintReportDataCols: Partial<ColsData<
  GuestComplaintReportData
>> = {
  roomType: {
    header: 'Room / Room Type',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  guestName: {
    header: 'Guest Name',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  serviceItem: {
    header: 'Service Item',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  complaint: {
    header: 'Complaint',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  status: {
    header: 'Status',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  actionTakenBy: {
    header: 'Action Taken By',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  customerSentiment: {
    header: 'Customer Sentiment',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  sla: {
    header: 'SLA',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  jobDuration: {
    header: 'Job Duration',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
};
export const guestEscalationComplaintReportCols: Partial<ColsData<
  GuestEscalationComplaintReportData
>> = {
  ...guestComplaintReportDataCols,
  escalationLevel: {
    header: 'Escalation Level',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  escalatedTo: {
    header: 'Escalated To',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
};

export const guestHistoryCols: ColsData<GuestHistoryData> = {
  guestName: {
    header: 'Guest Name',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  firstStayed: {
    header: 'First Stayed',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  lastStayed: {
    header: 'Last Stayed',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  noOfResv: {
    header: '# of Resv',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  roomCharges: {
    header: 'Room Charges',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  roomTax: {
    header: 'Room Tax',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  otherCharges: {
    header: 'Other Charges',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  totalCharges: {
    header: 'Total Charges',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  totalAmount: {
    header: 'Total Amount',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  amountPaid: {
    header: 'Amount Paid',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  balance: {
    header: 'Balance',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
};

export const guestContactReportCols: Partial<ColsData<
  GuestContactReportData
>> = {
  // guestId: {
  //   header: 'Guest Id',
  //   isSortDisabled: true,
  // },
  salutation: {
    header: 'Salutation',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  name: {
    header: 'Name',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  address: {
    header: 'Address',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  city: {
    header: 'City',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  state: {
    header: 'State',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  country: {
    header: 'Country',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  nationality: {
    header: 'Nationality',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  // phone: {
  //   header: 'Phone',
  //   isSortDisabled: true,
  // },
  mobileNo: {
    header: 'Mobile No',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  // fax: {
  //   header: 'Fax',
  //   isSortDisabled: true,
  // },
  zipCode: {
    header: 'Zip',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  email: {
    header: 'Email',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  gender: {
    header: 'Gender',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  dateOfBirth: {
    header: 'DOB',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  // idType: {
  //   header: 'ID Type',
  //   isSortDisabled: true,
  // },
};

export const SalesByGuestCols: ColsData<SalesByGuestData> = {
  guestId: {
    header: 'Guest Id',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  firstName: {
    header: 'First Name',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  LastName: {
    header: 'Last Name',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  country: {
    header: 'Country',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  emailId: {
    header: 'Email Id',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  firstStayed: {
    header: 'First Stayed',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  lastStayed: {
    header: 'Last Stayed',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  noOfRes: {
    header: 'No. of Res',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  nights: {
    header: 'Nights',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  totalSales: {
    header: 'Total Sales',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
};

export const guestLedgerCols: ColsData<Omit<
  GuestLedgerData,
  'reservationId'
>> = {
  roomNo: {
    header: 'Room No',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  name: {
    header: 'Name',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  confirmationNo: {
    header: 'Conf. No.',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  balance: {
    header: 'Balance',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
};

export const guestTypeReportCols: ColsData<Omit<
  GuestTypeReportData,
  'reservationId'
>> = {
  guestType: {
    header: 'Type',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  reservationNumber: {
    header: 'Res#',
    isSearchDisabled: false,
    isSortDisabled: true,
  },
  room: {
    header: 'Room',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  guestName: {
    header: 'Guest Name',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  checkIn: {
    header: 'Check In',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  checkOut: {
    header: 'Check Out',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  nights: {
    header: 'Nights',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  roomCharge: {
    header: 'Room Charge',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  roomTax: {
    header: 'Room Tax',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  otherCharges: {
    header: 'Other Charges',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  otherTax: {
    header: 'Other Tax',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  amount: {
    header: 'Amount',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  amountPaid: {
    header: 'Amount Paid',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
};
