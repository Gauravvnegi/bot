import { Component, OnInit } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { StepperEmitType } from 'libs/admin/shared/src/lib/components/stepper/stepper.component';
import { MenuItem } from 'primeng/api';
import { BarPriceService } from '../../services/bar-price.service';
import { RoomTypes } from '../../types/bar-price.types';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Revenue } from '../../constants/revenue-manager.const';

@Component({
  selector: 'hospitality-bot-dynamic-pricing',
  templateUrl: './dynamic-pricing.component.html',
  styleUrls: [
    '../bar-price/bar-price.component.scss',
    './dynamic-pricing.component.scss',
  ],
})
export class DynamicPricingComponent implements OnInit {
  activeStep = 0;
  allRooms: RoomTypes[];
  entityId: string;
  dynamicPricingFG: FormGroup;
  currentDay = new Date();
  seventhDay = new Date();
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
  constructor(
    private barPriceService: BarPriceService,
    private fb: FormBuilder,
    private globalFilter: GlobalFilterService
  ) {}

  ngOnInit(): void {
    this.entityId = this.globalFilter.entityId;
    this.currentDay.setHours(0, 0, 0, 0);
    this.seventhDay.setHours(0, 0, 0, 0);
    this.seventhDay.setDate(this.seventhDay.getDate() + 7);
    this.initRoom();
  }

  initRoom() {
    this.barPriceService.roomDetails.subscribe((res) => {
      if (this.barPriceService.isRoomDetailsLoaded) {
        this.allRooms = res;
        this.initFG();
      } else {
        this.barPriceService.loadRoomTypes(this.entityId);
      }
    });
  }

  initFG() {
    this.dynamicPricingFG = this.fb.group({
      occupancyFA: this.fb.array([this.seasonFG]),
      inventoryAllocationFA: this.fb.array([this.getInventoryAllocationFG()]),
      timeFA: this.fb.array([this.getTriggerFG()]),
    });
  }

  get seasonFG() {
    return this.fb.group({
      status: [true],
      type: ['add'], // it should be ModeType -> 'add'|'update'
      name: ['', [Validators.required]],
      fromDate: [this.currentDay, [Validators.required]],
      toDate: [this.seventhDay, [Validators.required]],
      configCategory: ['ROOM_TYPE'],
      roomType: [, [Validators.required]],
      selectedDays: ['', [Validators.required]],
      roomTypes: this.fb.array(this.getRoomTypesFA()),
    });
  }
  getRoomTypesFA() {
    return this.allRooms.map((room) =>
      this.fb.group({
        isSelected: [true],
        roomId: [room.value],
        roomName: [room.label],
        basePrice: [room.price],
        occupancy: this.fb.array([this.seasonOccupancyFG]),
      })
    );
  }

  get seasonOccupancyFG(): FormGroup {
    return this.fb.group({
      start: [, [Validators.min(0), Validators.required]],
      end: [, [Validators.min(0), Validators.required]],
      discount: [, [Validators.min(-100), Validators.required]],
      rate: [, [Validators.min(0), Validators.required]],
    });
  }

  getTriggerFG(data?: any): FormGroup {
    const triggerFG = this.fb.group({
      name: [''],
      fromDate: [''],
      toDate: [''],
      selectedDays: [[]],
      levels: this.fb.array([this.getLevelFG()]),
      status: [true],
    });
    if (data) triggerFG.patchValue(data);
    return triggerFG;
  }

  getLevelFG(): FormGroup {
    return this.fb.group({
      time: [''],
      occupancyLowerLimit: [''],
      occupancyUpperLimit: [''],
      discount: [''],
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
    if (this.allRooms)
      this.addRoomAllocationControl(
        triggerFG.get('reallocations') as FormArray
      );
    if (data) triggerFG.patchValue(data);
    return triggerFG;
  }

  addRoomAllocationControl(allocationFA: FormArray) {
    this.allRooms.forEach((item) => {
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

  modifyInventoryAllocationFG(event: { mode: string; index?: number }): void {
    if (event.mode == Revenue.add)
      this.dynamicPricingControl.inventoryAllocationFA.controls.push(
        this.getInventoryAllocationFG()
      );
    else if (
      this.dynamicPricingControl.inventoryAllocationFA.controls.length > 1
    )
      this.dynamicPricingControl.inventoryAllocationFA.removeAt(event.index);
  }

  onActive(event: StepperEmitType) {
    this.activeStep = event.index;
  }

  modifyTriggerFG(event: { mode: string; index?: number }): void {
    if (event.mode == Revenue.add)
      this.dynamicPricingControl.timeFA.controls.push(this.getTriggerFG());
    else this.dynamicPricingControl.timeFA.removeAt(event.index);
  }

  modifyLevelFG(event: {
    triggerFG: FormGroup;
    mode: string;
    index?: number;
  }): void {
    const levelFA = event.triggerFG.get('levels') as FormArray;
    if (event.mode == Revenue.add) levelFA.controls.push(this.getLevelFG());
    else levelFA.removeAt(event.index);
  }

  get dynamicPricingControl() {
    return this.dynamicPricingFG.controls as Record<
      'inventoryAllocationFA' | 'timeFA' | 'occupancyFA',
      AbstractControl
    > & {
      inventoryAllocationFA: FormArray;
      timeFA: FormArray;
      occupancyFA: FormArray;
    };
  }
}
