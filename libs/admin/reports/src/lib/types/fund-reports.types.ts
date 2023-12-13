export type AddWithdrawReportData = {
  createdDate: string;
  fundTransferredBy: string;
  action: string;
  amount: string;
  paymentMode: string;
  comments: string;
};

export type AddWithdrawReportResponse = {
  amount: number;
  created: number;
  id: string;
  paymentMethod: string;
  remarks: string;
  reservationId: string;
  reservationNumber: string;
  status: string;
  transactionId: string;
};
