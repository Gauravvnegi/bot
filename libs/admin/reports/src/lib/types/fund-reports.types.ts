export type AddWithdrawReportData = {
  createdDate: string;
  fundTransferredBy: string;
  action: string;
  amount: string;
  paymentMode: string;
  comments: string;
};

export type AddWithdrawReportResponse = {
  cashier: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    type: string;
    title: string;
    cc: string;
    phoneNumber: string;
    profileUrl: string;
    parentId: string;
    status: true;
  };
  amount: number;
  created: number;
  id: string;
  paymentMethod: string;
  paymentType: string;
  remarks: string;
  reservationId: string;
  reservationNumber: string;
  status: string;
  transactionId: string;
};
