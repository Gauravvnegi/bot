import { Injectable } from '@angular/core';
import { MenuItemCard } from '../types/menu-order';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OutletFormService {
  private selectedMenuItems: BehaviorSubject<
    MenuItemCard[]
  > = new BehaviorSubject<MenuItemCard[]>([]);

  // Expose it as an observable for external components
  selectedMenuItems$: Observable<
    MenuItemCard[]
  > = this.selectedMenuItems.asObservable();

  // Method to add an item to the selectedMenuItems array
  addItemToSelectedItems(item: MenuItemCard): void {
    const currentItems = this.selectedMenuItems.value;
    const updatedItems = currentItems ? [...currentItems, item] : [item];
    this.selectedMenuItems.next(updatedItems);
  }

  // Method to remove an item from the selectedMenuItems array
  removeItemFromSelectedItems(item: MenuItemCard): void {
    const currentItems = this.selectedMenuItems.value;
    if (!currentItems) return; // No items to remove

    const updatedItems = currentItems.filter(
      (selectedItem) => selectedItem !== item
    );
    this.selectedMenuItems.next(updatedItems);
  }
  constructor() {}
}
