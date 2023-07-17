import {
  EntityStateCountsResponse,
  EntityTypeCountsResponse,
} from '../models/reservations.model';
/* Reservation List Response Types deceleration */
export type ReservationListResponse = {
  records?: ReservationResponse[];
  total: number;
  entityStateCounts: EntityStateCountsResponse;
  entityTypeCounts: EntityTypeCountsResponse;
};

/* Reservation Response Types Deceleration*/
export type ReservationResponse = {
  id: string;
  entityId: string;
  invoiceId: string;
  rooms: number;
  roomType: string;
  confirmationNo: string;
  name: string;
  company: string;
  outletType?: string;
  outletName?: string;
  date: string;
  amount: number;
  source: string;
  payment: string;
  status: string;
  reservationTypes: string;
  reservationNumber: string;
  totalDueAmount: number;
  firstName: string;
  lastName: string;
  paymentMethod: string;
  totalPaidAmount: number;
  roomCount: number;
  reservationType: string;
  from: number;
  to: number;
  totalAmount: number;
  fullName: string;
  roomNumber: number;
  nextStates: string[];
  sourceName: string;
};

export type PaymentConfigResponse = {
  label: string;
  description: string;
  iconUrl: string;
  type: PaymentMethodConfig[];
};

export type PaymentMethodConfig = {
  id: string;
  entityId: string;
  merchantId?: string;
  accessCode?: string;
  chainId?: string;
  secretKey?: string;
  externalRedirect: boolean;
  iconUrl: string;
  currency?: string;
  description: string;
  status: boolean;
  type: string;
  imageUrl?: string;
  label: string;
  instructions?: any;
};