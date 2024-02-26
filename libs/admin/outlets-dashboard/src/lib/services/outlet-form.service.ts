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
import {
  PosReservationResponse,
  ReservationTableResponse,
} from '../types/reservation-table';
import { MealPreferences, OrderTypes } from '../types/menu-order';

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

  getOutletFormData(data: MenuForm, orderId?: string) {
    const { orderInformation, paymentInformation, kotInformation } = data;
    const orderData: CreateOrderData = {
      status: 'CONFIRMED',
      type: orderInformation.orderType,
      source: 'Offline',
      kots: kotInformation.kotItems.map((kotItem) => ({
        instructions: kotItem.kotInstruction,
        items: kotItem.items.map((item) => ({
          itemId: item.itemId,
          unit: item.unit,
          amount: item.price,
          remarks: item.itemInstruction,
        })),
      })),
      offer: {
        id:
          kotInformation.kotItems[kotInformation.kotItems.length - 1].kotOffer,
      },
      outletType: EntitySubType.RESTAURANT,
      guestId: orderInformation.guest,
      deliveryAddress:
        orderInformation.orderType === OrderTypes.DELIVERY
          ? orderInformation.address.id
          : undefined,
      reservation: {
        occupancyDetails: { maxAdult: orderInformation.numberOfPersons },
        status: 'CONFIRMED',
        tableIds: [orderInformation.tableNumber],
        areaId: orderInformation.areaId,
      },
      paymentDetails: {
        paymentMethod: paymentInformation?.paymentMethod ?? '',
        amount: paymentInformation?.paymentRecieved ?? 0,
        transactionId: paymentInformation?.transactionId ?? '',
      },
    };
    return orderData;
  }

  getOutletUpdateData(data: MenuForm, reservationData: PosReservationResponse) {
    const { orderInformation, paymentInformation, kotInformation } = data;

    const orderData: CreateOrderData = {
      status: 'CONFIRMED',
      type: orderInformation.orderType,
      source: 'Offline',
      kots: kotInformation.kotItems.map((kotItem) => ({
        instructions: kotItem.kotInstruction,
        items: kotItem.items.map((item) => ({
          itemId: item.itemId,
          unit: item.unit,
          amount: item.price,
          remarks: item.itemInstruction,
          id: item.id !== null ? item.id : undefined,
        })),
        id: kotItem.id !== null ? kotItem.id : undefined,
      })),
      offer: {
        id:
          kotInformation.kotItems[kotInformation.kotItems.length - 1].kotOffer,
      },
      outletType: EntitySubType.RESTAURANT,
      guestId: orderInformation.guest,
      deliveryAddress: orderInformation.address.id,
      reservation: {
        ...reservationData,
        occupancyDetails: { maxAdult: orderInformation.numberOfPersons },
        status: 'CONFIRMED',
        tableIds: [orderInformation.tableNumber],
        id:
          data.orderInformation.id !== null
            ? data.orderInformation.id
            : undefined,
      },
      paymentDetails: {
        paymentMethod: paymentInformation?.paymentMethod ?? '',
        amount: paymentInformation?.paymentRecieved ?? 0,
        transactionId: paymentInformation?.transactionId ?? '',
      },
    };
    return orderData;
  }

  getGuestFormData(data: AddGuestForm) {
    const formData: CreateReservationData = {
      occupancyDetails: { maxAdult: data.personCount },
      status: 'CONFIRMED',
      guestId: data.guest,
      tableIds: [data.tables], //@multipleTableBooking
      from: data.checkIn,
      to: data.checkOut,
      marketSegment: data.marketSegment,
      outletType: data.outletType,
      areaId: data.areaId,
      currentJourney: data.seated ? 'SEATED' : 'WAITLISTED',
      source: data.source,
      sourceName: data.sourceName,
      specialRequest: data?.remark,
    };

    return formData;
  }

  mapOrderData(data: ReservationTableResponse) {
    let formData = new MenuForm();
    formData.orderInformation = {
      search: '',
      tableNumber: data?.reservation.tableIdOrRoomId,
      staff: data?.createdBy,
      guest: data?.guest?.id,
      numberOfPersons: data?.reservation.occupancyDetails.maxAdult,
      menu: data?.items?.map((item) => item?.itemId),
      orderType: data?.type,
      id: data.reservation.id,
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
            itemId: item?.itemId,
            mealPreference: item.menuItem?.mealPreference
              .replace(/[-_]/g, '')
              .toUpperCase() as MealPreferences,
            price: item.menuItem?.dineInPrice,
            itemInstruction: item?.remarks,
            image: item.menuItem?.imageUrl,
            viewItemInstruction: false,
          })),
        kotInstruction: kot?.instructions,
        kotOffer: data?.offer?.id,
        viewKotOffer: false,
        viewKotInstruction: false,
        id: kot?.id,
      })),
    };
    this.orderFormData.next(data);
    return formData;
  }
}
