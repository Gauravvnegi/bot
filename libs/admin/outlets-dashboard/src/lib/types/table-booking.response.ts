import { PricingDetails } from './outlet.response';
import { PosOrderResponse } from './reservation-table';

interface Area {
  id: string;
  name: string;
  status: boolean;
  shortDescription: string;
}

interface MenuItem {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  popular: boolean;
  mealPreference: string;
  category: string;
  preparationTime: number;
  quantity: number;
  unit: string;
  dineInPrice: number;
  deliveryPrice: number;
  hsnCode: string;
  entityId: string;
  status: boolean;
  itemCode: string;
  parentId: string;
}

export type TableReservationResponse = {
  id: string;
  number: string;
  created: number;
  updated: number;
  reservationId: string;
  pax: number;
  area: Area;
  entityId: string;
  inventoryType: string;
  frontOfficeState: string;
  status: string;
  booking: {
    id: string;
    from: string;
    to: number;
    entityId: string;
    occupancyDetails: {
      maxChildren: number;
      maxAdult: number;
    };
    source: string;
    sourceName: string;
    marketSegment: string;
    reservationNumber: string;
    status: string;
    guest: {
      id: string;
      firstName: string;
      lastName: string;
      contactDetails: {
        cc: string;
        contactNumber: string;
        emailId: string;
      };
      dateOfBirth: number;
      age: number;
      type: string;
      isVerified: boolean;
      status: boolean;
      code: string;
      created: number;
      updated: number;
      gender: string;
      creditLimit: number;
      creditLimitUsed: number;
    };
    tableNumberOrRoomNumber: string;
    created: number;
    updated: number;
    nextStates: string[];
    items: [];
    outletType: string;
    currentJourney: string;
    currentJoureyStatus: string;
    currentJourneyState: string;
    systemAction: boolean;
    totalReservationAmount: number;
    printRate: boolean;
    order: PosOrderResponse;
    tableIdOrRoomId: string;
    areaId: string;
    externalBooking: boolean;
  };
};

export type TableReservationListResponse = {
  total: number;
  entityTypeCounts: { [key: string]: number };
  entityStateCounts: { [key: string]: number };
  tables: TableReservationResponse[];
};
