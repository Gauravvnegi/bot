import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MenuItem } from 'libs/admin/all-outlets/src/lib/models/outlet.model';
import {
  CreateOrderData,
  CreateReservationData,
  MenuForm,
} from '../types/form';
import { EntitySubType } from '@hospitality-bot/admin/shared';
import { ReservationStatus } from '../types/reservation-table';
import { GuestReservationForm } from '../components/add-guest-list/add-guest-list.component';
import {
  PosReservationResponse,
  PosOrderResponse,
} from '../types/reservation-table';
import { OrderTypes } from '../types/menu-order';

@Injectable({
  providedIn: 'root',
})
export class OutletFormService {
  selectedMenuItems: BehaviorSubject<MenuItem[]> = new BehaviorSubject<
    MenuItem[]
  >([]);

  orderFormData: BehaviorSubject<
    Omit<PosOrderResponse, 'reservation'>
  > = new BehaviorSubject<Omit<PosOrderResponse, 'reservation'>>(null);
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
    if (!currentItems?.length) return; // No items to remove
    const updatedItems = itemId
      ? currentItems.filter((selectedItem) => selectedItem.id !== itemId)
      : [];
    this.selectedMenuItems.next(updatedItems);
  }

  constructor() {}

  resetData() {
    this.selectedMenuItems.next([]);
    this.orderFormData.next(null);
  }

  getOutletFormData(data: MenuForm, reservationData?: PosReservationResponse) {
    const {
      reservationInformation,
      paymentInformation,
      kotInformation,
      offer,
    } = data;
    const {
      id,
      orderType,
      tableNumber,
      areaId,
      numberOfPersons,
      address,
      guest,
    } = reservationInformation;

    const orderData: CreateOrderData = {
      status: 'CONFIRMED',
      type: orderType,
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
      offer: offer ? { id: offer } : undefined,
      outletType: EntitySubType.RESTAURANT,
      guestId: guest,
      deliveryAddress:
        orderType === OrderTypes.DELIVERY ? address.id : undefined,
      reservation:
        orderType === OrderTypes.DINE_IN
          ? {
              ...reservationData, // Spread operator here if reservationData exists
              occupancyDetails: {
                maxAdult: numberOfPersons,
              },
              status: 'CONFIRMED',
              tableIds: [tableNumber],
              areaId: areaId,
              currentJourney: 'SEATED',
              id: id ? id : undefined,
            }
          : undefined,
      paymentDetails: {
        paymentMethod: paymentInformation?.paymentMethod ?? '',
        amount: paymentInformation?.paymentRecieved ?? 0,
        transactionId: paymentInformation?.transactionId ?? '',
      },
    };
    return orderData;
  }

  getOutletUpdateData(data: MenuForm, reservationData: PosReservationResponse) {
    const {
      reservationInformation,
      paymentInformation,
      kotInformation,
      offer,
    } = data;

    const orderData: CreateOrderData = {
      status: 'CONFIRMED',
      type: reservationInformation.orderType,
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
      offer: offer ? { id: offer } : undefined,
      outletType: EntitySubType.RESTAURANT,
      guestId: reservationInformation.guest,
      deliveryAddress:
        reservationInformation.orderType === OrderTypes.DELIVERY
          ? reservationInformation.address.id
          : undefined,
      reservation: {
        ...reservationData,
        occupancyDetails: { maxAdult: reservationInformation.numberOfPersons },
        status: 'CONFIRMED',
        tableIds: [reservationInformation.tableNumber],
        id:
          data.reservationInformation.id !== null
            ? data.reservationInformation.id
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

  getGuestFormData(data: GuestReservationForm) {
    const formData: CreateReservationData = {
      occupancyDetails: { maxAdult: data.personCount },
      status: data?.reservationType as ReservationStatus,
      guestId: data.guest,
      tableIds: [data.tables], //@multipleTableBooking
      from: data.checkIn,
      to: data.checkOut,
      marketSegment: data.marketSegment,
      outletType: data.outletType,
      areaId: data.areaId,
      currentJourney: data.currentJourney,
      // data?.reservationType === 'CONFIRMED' && data.seated
      //   ? 'SEATED'
      //   : 'WAITLISTED',

      source: data.source,
      sourceName: data.sourceName,
      specialRequest: data?.remark,
    };

    return formData;
  }

  mapOrderData(data: PosOrderResponse) {
    let formData = new MenuForm();

    const address = data.deliveryAddress;
    formData.reservationInformation = {
      search: '',
      tableNumber: data?.reservation?.tableIdOrRoomId,
      staff: '',
      guest: data?.guest?.id,
      numberOfPersons: data?.reservation?.occupancyDetails?.maxAdult,
      menu: data?.items?.map((item) => item?.itemId),
      orderType: data?.type,
      id: data?.reservation?.id,
      address: {
        formattedAddress: `${address?.addressLine1 ?? ''}`,
        city: address?.city ?? '',
        state: address?.state ?? '',
        countryCode: address?.countryCode ?? '',
        postalCode: address?.postalCode ?? '',
        id: address?.id,
      },
    };

    formData.offer = data?.items?.filter(
      (item) => item.type === 'ITEM_OFFER'
    )[0].id;

    formData.kotInformation = {
      kotItems: data?.kots?.map((kot) => ({
        items: data?.items
          ?.filter((item) => item?.menuItem)
          .map((item) => ({
            id: item?.id,
            itemName: item.menuItem?.name,
            unit: item?.unit,
            itemId: item?.itemId,
            mealPreference: item.menuItem?.mealPreference,
            price: item.menuItem?.dineInPrice,
            itemInstruction: item?.remarks,
            image: item.menuItem?.imageUrl,
            viewItemInstruction: false,
          })),
        kotInstruction: kot?.instructions,
        viewKotInstruction: false,
        id: kot?.id,
      })),
    };

    this.orderFormData.next(data);

    return formData;
  }

  mapReservationData(data: PosReservationResponse) {
    let formData = new MenuForm();

    const address = data.deliveryAddress;
    formData.reservationInformation = {
      search: '',
      tableNumber: data?.tableIdOrRoomId,
      staff: '',
      guest: data?.guest?.id,
      numberOfPersons: data?.occupancyDetails?.maxAdult,
      menu: data?.order.items?.map((item) => item?.itemId),
      orderType: data?.order.type,
      id: data?.id,
      address: {
        formattedAddress: `${address?.addressLine1 ?? ''}`,
        city: address?.city ?? '',
        state: address?.state ?? '',
        countryCode: address?.countryCode ?? '',
        postalCode: address?.postalCode ?? '',
        id: address?.id,
      },
    };

    formData.offer = data?.order.items?.filter(
      (item) => item.type === 'ITEM_OFFER'
    )[0].id;

    formData.kotInformation = {
      kotItems: data?.order?.kots?.map((kot) => ({
        items: data?.order?.items
          ?.filter((item) => item?.menuItem)
          .map((item) => ({
            id: item?.id,
            itemName: item.menuItem?.name,
            unit: item?.unit,
            itemId: item?.itemId,
            mealPreference: item.menuItem?.mealPreference,
            price: item.menuItem?.dineInPrice,
            itemInstruction: item?.remarks,
            image: item.menuItem?.imageUrl,
            viewItemInstruction: false,
          })),
        kotInstruction: kot?.instructions,
        viewKotInstruction: false,
        id: kot?.id,
      })),
    };

    this.orderFormData.next(data.order);

    return formData;
  }
}
