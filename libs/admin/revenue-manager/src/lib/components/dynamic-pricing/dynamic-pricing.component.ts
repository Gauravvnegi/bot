import { Component, OnInit } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { StepperEmitType } from 'libs/admin/shared/src/lib/components/stepper/stepper.component';
import { MenuItem } from 'primeng/api';
import { BarPriceService } from '../../services/bar-price.service';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Revenue } from '../../constants/revenue-manager.const';
import { DynamicPricingForm } from '../../types/dynamic-pricing.types';
import { RoomTypes } from 'libs/admin/channel-manager/src/lib/models/bulk-update.models';

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
    { label: 'Occupancy' },
    { label: 'Day/Time Trigger' },
    // { label: 'Inventory Reallocation' },
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
    const data: DynamicPricingForm = {
      occupancyFA: this.fb.array([]),
      inventoryAllocationFA: this.fb.array([this.getInventoryAllocationFG()]),
      timeFA: this.fb.array([this.getTriggerFG()]),
    };

    this.dynamicPricingFG = this.fb.group(data);
  }

  getTriggerFG(data?: any): FormGroup {
    const triggerFG = this.fb.group({
      name: ['', [Validators.required]],
      fromDate: ['', [Validators.required]],
      toDate: ['', [Validators.required]],
      selectedDays: [[], [Validators.required]],
      levels: this.fb.array([this.getLevelFG()]),
      status: [true, [Validators.required]],
    });
    if (data) triggerFG.patchValue(data);
    return triggerFG;
  }

  getLevelFG(): FormGroup {
    return this.fb.group({
      fromTime: ['', [Validators.required]],
      toTime: ['', [Validators.required]],
      occupancyLowerLimit: ['', [Validators.required]],
      occupancyUpperLimit: ['', [Validators.required]],
      discount: ['', [Validators.required]],
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
      keyof DynamicPricingForm,
      AbstractControl
    > & {
      inventoryAllocationFA: FormArray;
      timeFA: FormArray;
      occupancyFA: FormArray;
    };
  }

  get dynamicPricingInstance(): DynamicPricingComponent {
    return this;
  }
}
