import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Output() modifyInventoryAllocationFGEvent = new EventEmitter();
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
