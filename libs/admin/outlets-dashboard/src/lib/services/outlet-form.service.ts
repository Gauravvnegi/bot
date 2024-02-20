import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MenuItem } from 'libs/admin/all-outlets/src/lib/models/outlet.model';
import {
  AddGuestForm,
  CreateOrderData,
  CreateReservationData,
  MenuForm,
} from '../types/form';
import { EntitySubType } from '@hospitality-bot/admin/shared';
import { ReservationTableResponse } from '../types/reservation-table';
import { MealPreferences } from '../types/menu-order';

@Injectable({
  providedIn: 'root',
})
export class OutletFormService {
  selectedMenuItems: BehaviorSubject<MenuItem[]> = new BehaviorSubject<
    MenuItem[]
  >([]);

  orderFormData: BehaviorSubject<
    ReservationTableResponse
  > = new BehaviorSubject<ReservationTableResponse>(null);
  entityId: string;
  // Method to add an item to the selectedMenuItems array
  addItemToSelectedItems(item: MenuItem): void {
    const currentItems = this.selectedMenuItems.value;
    const updatedItems = currentItems ? [...currentItems, item] : [item];
    this.selectedMenuItems.next(updatedItems);
  }

  // Method to remove an item from the selectedMenuItems array
  removeItemFromSelectedItems(itemId?: string): void {
    const currentItems = this.selectedMenuItems.value;

    if (!currentItems) return; // No items to remove
    const updatedItems = itemId
      ? currentItems.filter((selectedItem) => selectedItem.id !== itemId)
      : [];
    this.selectedMenuItems.next(updatedItems);
  }

  constructor() {}

  resetData() {
    this.selectedMenuItems.next([]);
  }

  getOutletFormData(data: MenuForm, reservationId?: string, reservationData?) {
    const { orderInformation, paymentInformation, kotInformation } = data;
    const orderData: CreateOrderData = {
      status: 'CONFIRMED',
      type: orderInformation.orderType,
      source: 'Offline',
      kots: kotInformation.kotItems.map((item) => ({
        instructions: item.kotInstruction,
        items: item.items.map((item) => ({
          itemId: item.id,
          unit: item.unit,
          amount: item.price,
          remarks: item.itemInstruction,
        })),
        id: item?.id,
      })),
      outletType: EntitySubType.RESTAURANT,
      guestId: orderInformation.guest,
      reservation: reservationId
        ? reservationData
        : {
            occupancyDetails: { maxAdult: orderInformation.numberOfPersons },
            status: 'CONFIRMED',
            tableIds: orderInformation.tableNumber,
          },
    };
    return orderData;
  }

  getGuestFormData(data: AddGuestForm) {
    const formData: CreateReservationData = {
      occupancyDetails: { maxAdult: data.personCount },
      status: 'CONFIRMED',
      guestId: data.guest,
      tableIds: data.tables,
      from: data.checkIn,
      to: data.checkOut,
      marketSegment: data.marketSegment,
    };

    return formData;
  }

  mapOrderData(data: ReservationTableResponse) {
    let formData = new MenuForm();
    formData.orderInformation = {
      search: '',
      tableNumber: [data?.reservation.tableIdOrRoomId],
      staff: data?.createdBy,
      guest: data?.guest?.id,
      numberOfPersons: data?.reservation.occupancyDetails.maxAdult,
      menu: data?.items?.map((item) => item?.itemId),
      orderType: data?.type,
    };

    // Map kot information
    formData.kotInformation = {
      kotItems: data?.kots?.map((kot) => ({
        items: data?.items
          ?.filter((item) => item?.menuItem)
          .map((item) => ({
            id: item?.id,
            itemName: item.menuItem?.name,
            unit: item?.unit,
            mealPreference: item.menuItem?.mealPreference
              .replace(/[-_]/g, '')
              .toUpperCase() as MealPreferences,
            price: item.menuItem?.dineInPrice,
            itemInstruction: item?.remarks,
            image: item.menuItem?.imageUrl,
            viewItemInstruction: false,
          })),
        kotInstruction: kot?.instructions,
        kotOffer: [],
        viewKotOffer: false,
        viewKotInstruction: false,
        id: kot?.id,
      })),
    };
    this.orderFormData.next(data);
    return formData;
  }
}
