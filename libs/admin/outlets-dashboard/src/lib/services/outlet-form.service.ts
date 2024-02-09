import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MenuItem } from 'libs/admin/all-outlets/src/lib/models/outlet.model';
import { CreateOrderData, MenuForm } from '../types/form';
import { EntitySubType } from '@hospitality-bot/admin/shared';

@Injectable({
  providedIn: 'root',
})
export class OutletFormService {
  selectedMenuItems: BehaviorSubject<MenuItem[]> = new BehaviorSubject<
    MenuItem[]
  >([]);

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
}
