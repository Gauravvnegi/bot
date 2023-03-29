import { ReservationListResponse, ReservationResponse } from '../types/response.type'; 
/* Reservation */
export class Reservation { 
  id:string;
  hotelId:string;
  rooms:number;
  roomType:string;
  confirmationNo:string;
  guestName:string;
  guestCompany:string;
  date:string;
  amount:number;
  source:number;
  payment:string;
  status:string;
  type:string // OTA,AGENT, WALK-In, Offline Sales, Booking Engine

  deserialize(input: ReservationResponse) {
    this.id=input.id;
    this.hotelId=input.hotelId;
    this.rooms=input.rooms;
    this.roomType=input.roomType;
    this.confirmationNo=input.confirmationNo;
    this.guestName=input.name;
    this.guestCompany=input.company;
    this.date=input.date;
    this.amount=input.amount;
    this.source=input.source;
    this.payment=input.payment;
    this.status=input.status;
    this.type=input.reservationTypes; 
    return this;
  }
}

/* Lists of all type Reservations*/
export class ReservationList { 
  reservationData: Reservation[]; 
  total: number;
  entityStateCounts: EntityStateCounts;
  deserialize(input: ReservationListResponse | any ) {  
    this.reservationData = input.reservations?.map((item)=> new Reservation().deserialize(item)) ?? []; 
    this.total = input.total;
    this.entityStateCounts = new EntityStateCounts().deserialize(
      input.entityStateCounts
    );
    return this;
  }
}

export type EntityStateCountsResponse = {
  All: number;
  Draft: number;
  Confirmed: number;
  Cancelled: number;
};

export class EntityStateCounts {
  ALL: number;
  DRAFT: number;
  CONFIRMED: number;
  CANCELLED: number;
  deserialize(input: EntityStateCountsResponse) {
    this.ALL = input.All;
    this.DRAFT = input.Draft; 
    this.CONFIRMED = input.Confirmed; 
    this.CANCELLED = input.Cancelled; 
    return this;
  }
}
