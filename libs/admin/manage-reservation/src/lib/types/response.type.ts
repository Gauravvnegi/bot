import { EntityStateCountsResponse } from "../models/reservations.model";
/* Reservation List Response Types deceleration */
export type ReservationListResponse = { 
  reservationData?: ReservationResponse[]; 
  total: number;
  entityStateCounts: EntityStateCountsResponse;
};

/* Reservation Response Types Deceleration*/
export type ReservationResponse = {
  id:string,
  hotelId:string,
  rooms:number,
  roomType:string,
  confirmationNo:string,
  name:string,
  company:string, 
  date:string,
  amount:number,
  source:number,
  payment:string,
  status:string,
  reservationTypes:string  
}


