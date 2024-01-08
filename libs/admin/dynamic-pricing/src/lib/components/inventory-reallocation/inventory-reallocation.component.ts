import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { weeks } from 'libs/admin/channel-manager/src/lib/constants/bulkupdate-response';
import { Revenue } from '../../constants/revenue-manager.const';

@Component({
  selector: 'hospitality-bot-inventory-reallocation',
  templateUrl: './inventory-reallocation.component.html',
  styleUrls: ['./inventory-reallocation.component.scss'],
})
export class InventoryReallocationComponent {
  @Input() dynamicPricingFG: FormGroup;
  @Output() modifyInventoryAllocationFGEvent = new EventEmitter();
  weeks = weeks;

  modifyInventoryAllocationFG(mode = Revenue.add, index?: number): void {
    this.modifyInventoryAllocationFGEvent.emit({ mode, index });
  }

  get dynamicPricingControl() {
    return this.dynamicPricingFG.controls as Record<
      'inventoryAllocationFA',
      AbstractControl
    > & {
      inventoryAllocationFA: FormArray;
    };
  }
}
