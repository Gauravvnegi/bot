export type ReservationStatus =
  | 'COMPLETED'
  | 'CONFIRMED'
  | 'CANCELED'
  | 'PREPARING'
  | 'BLANK_TABLE'
  | 'PAID'
  | 'RUNNING_KOT_TABLE'
  | 'RUNNING_TABLE'
  | 'PRINTED_TABLE';

export type OrderMethod = 'DELIVERY' | 'DINEIN' | 'PICKUP';

export type PaymentStatus = 'PAID' | 'UNPAID';

export type PaymentData = {
  icon: string;
  text: string;
};

export type ReservationStatusData = {
  borderColor: string;
};

export type TableStatus =
  | 'RUNNING_KOT_TABLE'
  | 'RUNNING_TABLE'
  | 'PRINTED_TABLE';
