import { Component, Input, OnInit } from '@angular/core';
import { MenuItemCard, mealPreferenceConfig } from '../../types/menu-order';
import { OutletFormService } from '../../services/outlet-form.service';
import { ControlContainer, FormGroup } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-menu-item-card',
  templateUrl: './menu-item-card.component.html',
  styleUrls: ['./menu-item-card.component.scss'],
})
export class MenuItemCardComponent implements OnInit {
  @Input() itemCard: MenuItemCard;
  selectedItems: MenuItemCard[] = [];
  parentFormGroup: FormGroup;
  readonly mealPreferenceConfig = mealPreferenceConfig;

  constructor(private formService: OutletFormService) {}

  ngOnInit(): void {
    this.formService.selectedMenuItems.subscribe((items) => {
      this.selectedItems = items;
    });
  }

  addItem() {
    this.formService.addItemToSelectedItems(this.itemCard);
  }

  removeItem() {
    this.formService.removeItemFromSelectedItems(this.itemCard.id);
  }

  checkSelectedItemCTA(action: 'add' | 'remove'): boolean {
    const isSelected = this.selectedItems.some(
      (selectedItem) => selectedItem.id === this.itemCard.id
    );

    return action === 'add' ? !isSelected : isSelected;
  }
}
