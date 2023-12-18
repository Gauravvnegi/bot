import { Component, OnInit } from '@angular/core';
import {
  GlobalFilterService,
  RouteConfigPathService,
  RoutesConfigService,
} from '@hospitality-bot/admin/core/theme';
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
import {
  ConfigType,
  DynamicPricingForm,
  RuleType,
} from '../../types/dynamic-pricing.types';
import { RoomTypes } from 'libs/admin/channel-manager/src/lib/models/bulk-update.models';
import { DynamicPricingService } from '../../services/dynamic-pricing.service';
import { Subscription } from 'rxjs';
import {
  AdminUtilityService,
  NavRouteOption,
  NavRouteOptions,
  QueryConfig,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'hospitality-bot-dynamic-pricing',
  templateUrl: './dynamic-pricing.component.html',
  styleUrls: [
    '../bar-price/bar-price.component.scss',
    './dynamic-pricing.component.scss',
  ],
})
export class DynamicPricingComponent implements OnInit {
  allRooms: RoomTypes[];
  entityId: string;
  dynamicPricingFG: FormGroup;

  ruleId: string;
  activeRule: RuleType;

  loading = false;
  $subscription = new Subscription();
  navRoutes: NavRouteOptions = [{ label: 'Create Season', link: './' }];

  constructor(
    private barPriceService: BarPriceService,
    private dynamicPricingService: DynamicPricingService,
    private adminUtilityService: AdminUtilityService,
    private fb: FormBuilder,
    private globalFilter: GlobalFilterService,
    private routeConfigService: RoutesConfigService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activeRule = (this.activatedRoute.snapshot.data
      .ruleType as unknown) as RuleType;
    this.ruleId = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.entityId = this.globalFilter.entityId;
    this.initNavRoutes();
  }

  initNavRoutes() {
    this.routeConfigService.navRoutesChanges.subscribe((navRoutes) => {
      this.navRoutes = [...navRoutes, ...this.navRoutes];
    });
  }

  initFG() {
    const data: DynamicPricingForm = {
      occupancyFA: this.fb.array([]),
      inventoryAllocationFA: this.fb.array([this.getInventoryAllocationFG()]),
      timeFA: this.fb.array([]),
    };

    this.dynamicPricingFG = this.fb.group(data);
  }

  getTriggerFG(data?: any): FormGroup {
    const triggerFG = this.fb.group({
      id: [],
      hotelId: [this.entityId],
      name: ['', [Validators.required]],
      fromDate: ['', [Validators.required]],
      toDate: ['', [Validators.required]],
      type: ['add'],
      removedRules: this.fb.array([]),
      selectedDays: [, [Validators.required]],
      configCategory: ['HOTEL'],
      hotelConfig: this.fb.array([this.getLevelFG()]),
      status: [true, [Validators.required]],
    });
    if (data) triggerFG.patchValue(data);
    return triggerFG;
  }

  getLevelFG(): FormGroup {
    return this.fb.group(
      {
        id: [],
        fromTime: ['', [Validators.required]],
        toTime: ['', [Validators.required]],
        start: ['', [Validators.min(1), Validators.required]],
        end: ['', [Validators.min(1), Validators.required]],
        discount: ['', [Validators.required]],
      },
      { validators: this.dynamicPricingService.triggerLevelValidator }
    );
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

  modifyTriggerFG(event: { mode: string; index?: number }): void {
    if (event.mode == Revenue.add)
      this.dynamicPricingControl.timeFA.controls.push(this.getTriggerFG());
  }

  modifyLevelFG(event: {
    triggerFG: FormGroup;
    mode: string;
    index?: number;
  }): void {
    const levelFA = event.triggerFG?.get('hotelConfig') as FormArray;
    if (event.mode == Revenue.add) {
      levelFA.controls.push(this.getLevelFG());
    } else {
      const levelRemoveId = levelFA.at(event.index).value.id;
      if (levelRemoveId) {
        const removedRule = event.triggerFG.get('removedRules') as FormArray;
        removedRule.controls.push(levelRemoveId);
        removedRule.markAsDirty();
      }
      levelFA.removeAt(event.index);
    }
    levelFA.markAsDirty();
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

  getQueryConfig(type: ConfigType): QueryConfig {
    return {
      params: this.adminUtilityService.makeQueryParams([
        {
          type: type,
        },
      ]),
    };
  }
}
