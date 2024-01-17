import { Component, Input, OnInit } from '@angular/core';
import { MenuItemCard, mealPreferenceConfig } from '../../types/menu-order';
import { OutletFormService } from '../../services/outlet-form.service';

@Component({
  selector: 'hospitality-bot-menu-item-card',
  templateUrl: './menu-item-card.component.html',
  styleUrls: ['./menu-item-card.component.scss'],
})
export class MenuItemCardComponent implements OnInit {
  @Input() itemCard: MenuItemCard;

  readonly mealPreferenceConfig = mealPreferenceConfig;

  constructor(private formService: OutletFormService) {}

  ngOnInit(): void {}

  addItem() {
    this.itemCard.selected = true;
    this.formService.addItemToSelectedItems(this.itemCard);
  }

  removeItem() {
    this.itemCard.selected = false;
    this.formService.removeItemFromSelectedItems(this.itemCard);
  }
}
