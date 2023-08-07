import { Component, OnInit } from '@angular/core';
import { StepperEmitType } from 'libs/admin/shared/src/lib/components/stepper/stepper.component';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'hospitality-bot-dynamic-pricing',
  templateUrl: './dynamic-pricing.component.html',
  styleUrls: ['./dynamic-pricing.component.scss'],
})
export class DynamicPricingComponent implements OnInit {
  activeStep = 0;
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

  onActive(event: StepperEmitType) {
    this.activeStep = event.index;
  }
}
