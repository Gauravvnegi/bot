import {
  GuestContactReportData,
  GuestHistoryData,
  GuestLedgerData,
  SalesByGuestData,
} from '../types/guest-reports.types';
import { ColsData } from '../types/reports.types';

export const guestHistoryCols: ColsData<GuestHistoryData> = {
  guestName: {
    header: 'Guest Name',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  firstStayed: {
    header: 'First Stayed',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  lastStayed: {
    header: 'Last Stayed',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  noOfResv: {
    header: '# of Resv',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  roomCharges: {
    header: 'Room Charges',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  roomTax: {
    header: 'Room Tax',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  otherCharges: {
    header: 'Other Charges',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  totalCharges: {
    header: 'Total Charges',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  totalAmount: {
    header: 'Total Amount',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  amountPaid: {
    header: 'Amount Paid',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  balance: {
    header: 'Balance',
    isSortDisabled: true,
    isSearchDisabled: true,
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
  },
  name: {
    header: 'Name',
    isSortDisabled: true,
  },
  address: {
    header: 'Address',
    isSortDisabled: true,
  },
  city: {
    header: 'City',
    isSortDisabled: true,
  },
  state: {
    header: 'State',
    isSortDisabled: true,
  },
  country: {
    header: 'Country',
    isSortDisabled: true,
  },
  nationality: {
    header: 'Nationality',
    isSortDisabled: true,
  },
  // phone: {
  //   header: 'Phone',
  //   isSortDisabled: true,
  // },
  mobileNo: {
    header: 'Mobile No',
    isSortDisabled: true,
  },
  // fax: {
  //   header: 'Fax',
  //   isSortDisabled: true,
  // },
  zipCode: {
    header: 'Zip',
    isSortDisabled: true,
  },
  email: {
    header: 'Email',
    isSortDisabled: true,
  },
  gender: {
    header: 'Gender',
    isSortDisabled: true,
  },
  dateOfBirth: {
    header: 'DOB',
    isSortDisabled: true,
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
    isSearchDisabled: true,
  },
  firstName: {
    header: 'First Name',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  LastName: {
    header: 'Last Name',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  country: {
    header: 'Country',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  emailId: {
    header: 'Email Id',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  firstStayed: {
    header: 'First Stayed',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  lastStayed: {
    header: 'Last Stayed',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  noOfRes: {
    header: 'No. of Res',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  nights: {
    header: 'Nights',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  totalSales: {
    header: 'Total Sales',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
};

export const guestLedgerCols: ColsData<Omit<GuestLedgerData, 'id'>> = {
  roomNo: {
    header: 'Room No',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  name: {
    header: 'Name',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  confirmationNo: {
    header: 'Conf. No.',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  balance: {
    header: 'Balance',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
};
