import { Component, Input, OnInit } from '@angular/core';
import { mealPreferenceConfig } from '../../types/menu-order';
import { OutletFormService } from '../../services/outlet-form.service';
import { FormGroup } from '@angular/forms';
import { MenuItem } from 'libs/admin/all-outlets/src/lib/models/outlet.model';

@Component({
  selector: 'hospitality-bot-menu-item-card',
  templateUrl: './menu-item-card.component.html',
  styleUrls: ['./menu-item-card.component.scss'],
})
export class MenuItemCardComponent implements OnInit {
  @Input() itemCard: MenuItem;
  selectedItems: MenuItem[] = [];
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
