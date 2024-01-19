import { Component, OnInit } from '@angular/core';
import { MenuItemCard, mealPreferenceConfig } from '../../types/menu-order';
import { OutletFormService } from '../../services/outlet-form.service';

@Component({
  selector: 'hospitality-bot-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss'],
})
export class OrderSummaryComponent implements OnInit {
  selectedItems: MenuItemCard[] = [];
  readonly mealPreferenceConfig = mealPreferenceConfig;

  constructor(private formService: OutletFormService) {}

  ngOnInit(): void {
    this.listenForItemsChange();
  }

  listenForItemsChange() {
    this.formService.selectedMenuItems$.subscribe((res) => {
      if (res) this.selectedItems = res;
    });
  }

  clear() {}

  cancelOrder() {}
}
