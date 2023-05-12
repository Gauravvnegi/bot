import {
  EntityStateCountsResponse,
  EntityTypeCountsResponse,
  Status,
} from '../models/reservations.model';
/* Reservation List Response Types deceleration */
export type ReservationListResponse = {
  reservationData?: ReservationResponse[];
  total: number;
  entityStateCounts: EntityStateCountsResponse;
  entityTypeCounts: EntityTypeCountsResponse;
};

/* Reservation Response Types Deceleration*/
export type ReservationResponse = {
  id: string;
  hotelId: string;
  rooms: number;
  roomType: string;
  confirmationNo: string;
  name: string;
  company: string;
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
  statusValues: Status[];
  sourceName: string;
};
