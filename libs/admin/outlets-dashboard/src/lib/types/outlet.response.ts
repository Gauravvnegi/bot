import { EntityState } from "@hospitality-bot/admin/shared";

export type OutletReservationListResponse = {
    reservationData: OutletReservationResponse[];
    entityStateCounts: EntityState<string>;
    entityTypeCounts: EntityState<string>;
    total: number;
}

export type OutletReservationResponse = {
    name: string;
    reservationTime: string;
    adultCount: number;
    orderNumber: number;
    status: string;
    price: number;
    preparationTime: string;
    tableNumber: string;
}