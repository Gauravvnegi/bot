import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'hospitality-bot-dynamic-pricing',
  templateUrl: './dynamic-pricing.component.html',
  styleUrls: ['./dynamic-pricing.component.scss'],
})
export class DynamicPricingComponent implements OnInit {
  itemList: MenuItem[] = [
    {
      label: 'Occupancy',
    },
    {
      label: 'Day/Time Trigger',
    },
    {
      label: 'Inventory Reallocation',
    },
  ];
  constructor() {}

  ngOnInit(): void {}
}
