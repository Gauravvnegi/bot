import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { weeks } from 'libs/admin/channel-manager/src/lib/components/constants/bulkupdate-response';
import { Revenue } from '../../constants/revenue-manager.const';
import { BarPriceService } from '../../services/bar-price.service';
import { RoomTypes } from '../../types/bar-price.types';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';

@Component({
  selector: 'hospitality-bot-inventory-reallocation',
  templateUrl: './inventory-reallocation.component.html',
  styleUrls: ['./inventory-reallocation.component.scss'],
})
export class InventoryReallocationComponent implements OnInit {
  @Input() dynamicPricingFG: FormGroup;
  weeks = weeks;
  roomTypes: RoomTypes[];
  entityId: string;
  constructor(
    private barPriceService: BarPriceService,
    private fb: FormBuilder,
    private globalFilter: GlobalFilterService
  ) {}

  ngOnInit(): void {
    this.entityId = this.globalFilter.entityId;
    this.initRoomTypes();
  }

  initRoomTypes() {
    this.barPriceService.roomDetails.subscribe((rooms: RoomTypes[]) => {
      if (this.barPriceService.isRoomDetailsLoaded) {
        this.roomTypes = rooms;
      }
    });
  }

  getInventoryAllocationFG(data?: any): FormGroup {
    const triggerFG = this.fb.group({
      name: [''],
      fromDate: [''],
      toDate: [''],
      selectedDays: [[]],
      reallocations: this.fb.array([]),
      status: [true],
    });
    if (this.roomTypes)
      this.addRoomAllocationControl(
        triggerFG.get('reallocations') as FormArray
      );
    if (data) triggerFG.patchValue(data);
    return triggerFG;
  }

  modifyInventoryAllocationFG(mode = Revenue.add, index?: number): void {
    if (mode == Revenue.add)
      this.dynamicPricingControl.inventoryAllocationFA.controls.push(
        this.getInventoryAllocationFG()
      );
    else if (
      this.dynamicPricingControl.inventoryAllocationFA.controls.length > 1
    )
      this.dynamicPricingControl.inventoryAllocationFA.removeAt(index);
  }

  addRoomAllocationControl(allocationFA: FormArray) {
    this.roomTypes.forEach((item) => {
      allocationFA.push(
        this.fb.group({
          label: [item.label],
          percentage: [''],
          count: [''],
          value: [item.value],
        })
      );
    });
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
