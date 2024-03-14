import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MenuItem } from 'libs/admin/all-outlets/src/lib/models/outlet.model';
import {
  CreateOrderData,
  CreateReservationData,
  MenuForm,
} from '../types/form';
import { EntitySubType } from '@hospitality-bot/admin/shared';
import {
  GuestReservationForm,
  ReservationType,
} from '../components/add-guest-list/add-guest-list.component';
import {
  PosReservationResponse,
  PosOrderResponse,
} from '../types/reservation-table';
import {
  OrderSummaryData,
  OrderSummaryResponse,
  OrderTypes,
} from '../types/menu-order';

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

  getOrderSummary: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(
    false
  );

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
    this.getOrderSummary.next(false);
  }

  getOutletFormData(data: MenuForm, reservationData?: PosReservationResponse) {
    const {
      reservationInformation,
      paymentInformation,
      kotInformation,
      paymentSummary,
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
      kots: kotInformation.kotItems
        .map((kotItem) => {
          if (kotItem.items.length === 0) {
            return undefined;
          } else {
            return {
              instructions: kotItem.kotInstruction,
              items: kotItem.items.map((item) => ({
                itemId: item.itemId,
                unit: item.unit,
                amount: item.price,
                remarks: item.itemInstruction,
              })),
            };
          }
        })
        .filter((kot) => kot !== undefined),
      offer: offer ? { id: offer } : undefined,
      outletType: EntitySubType.RESTAURANT,
      guestId: guest,
      deliveryAddress:
        orderType === OrderTypes.DELIVERY ? address.id : undefined,
      reservation:
        orderType === OrderTypes.DINE_IN
          ? {
              ...reservationData, // Spread operator here if reservationData exists
              occupancyDetails: numberOfPersons
                ? {
                    maxAdult: numberOfPersons,
                  }
                : undefined,
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
      containerCharge:
        orderType !== OrderTypes.DINE_IN
          ? paymentSummary.totalContainerCharge
          : undefined,
    };
    return orderData;
  }

  getOutletUpdateData(data: MenuForm, reservationData: PosReservationResponse) {
    const {
      reservationInformation,
      paymentInformation,
      kotInformation,
      paymentSummary,
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
      reservation:
        reservationInformation.orderType === OrderTypes.DINE_IN
          ? {
              ...reservationData,
              occupancyDetails: reservationInformation?.numberOfPersons
                ? { maxAdult: reservationInformation.numberOfPersons }
                : undefined,
              status: 'CONFIRMED',
              tableIds: reservationInformation?.tableNumber
                ? [reservationInformation?.tableNumber]
                : undefined,
              id:
                data.reservationInformation.id !== null
                  ? data.reservationInformation.id
                  : undefined,
            }
          : undefined,
      paymentDetails: {
        paymentMethod: paymentInformation?.paymentMethod ?? '',
        amount: paymentInformation?.paymentRecieved ?? 0,
        transactionId: paymentInformation?.transactionId ?? '',
      },
      containerCharge: paymentSummary.totalContainerCharge,
    };
    return orderData;
  }

  getGuestFormData(data: GuestReservationForm) {
    const formData: CreateReservationData = {
      occupancyDetails: { maxAdult: data.personCount },
      status: data?.reservationType as ReservationType,
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
    )[0]?.itemId;

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

    const address = data?.deliveryAddress;
    formData.reservationInformation = {
      search: '',
      tableNumber: data?.tableIdOrRoomId,
      staff: '',
      guest: data?.guest?.id,
      numberOfPersons: data?.occupancyDetails?.maxAdult,
      menu: data?.order.items?.map((item) => item?.itemId),
      orderType: data?.order?.type,
      id: data?.id ?? '',
      address: {
        formattedAddress: `${address?.addressLine1 ?? ''}`,
        city: address?.city ?? '',
        state: address?.state ?? '',
        countryCode: address?.countryCode ?? '',
        postalCode: address?.postalCode ?? '',
        id: address?.id ?? '',
      },
    };

    formData.offer = data?.order.items?.filter(
      (item) => item.type === 'ITEM_OFFER'
    )[0]?.itemId;

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

  postOrderSummaryData(formData: MenuForm, orderId?: string) {
    let summaryData = new OrderSummaryData();
    const orderItems: { itemId: string; unit: number; amount: number }[] = [];

    formData?.kotInformation?.kotItems.forEach((kot) => {
      kot.items.forEach((item) => {
        const existingIndex = orderItems.findIndex(
          (el) => el.itemId === item.itemId
        );
        if (existingIndex !== -1) {
          // If item already exists, update its unit
          orderItems[existingIndex].unit += item.unit;
        } else {
          // Otherwise, add a new entry
          orderItems.push({
            itemId: item.itemId,
            unit: item.unit,
            amount: item.price, // Assuming price is available in item
          });
        }
      });
    });

    summaryData.outletType = EntitySubType.RESTAURANT;
    summaryData.outletOrder = {
      id: orderId,
      items: orderItems,
      type: formData.reservationInformation?.orderType,
    };
    summaryData.offerId = formData?.offer?.length ? formData.offer : undefined;
    return summaryData;
  }

  mapPaymentSummary(paymentData: OrderSummaryResponse) {
    const pricingDetails = paymentData.pricingDetails;
    return {
      totalCharge: pricingDetails.basePrice,
      totalContainerCharge: pricingDetails.containerCharge,
      totalDiscount: pricingDetails.discountedAmount,
      totalPayable: pricingDetails.totalAmount,
      totalPaidAmount: pricingDetails.totalPaidAmount,
      remainingBalance: pricingDetails.totalDueAmount,
      totalTaxes: pricingDetails.taxAndFees,
    };
  }
}
