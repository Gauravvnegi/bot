import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import {
  GlobalFilterService,
  RoutesConfigService,
} from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  NavRouteOptions,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import {
  LevelType,
  setupBarPriceSteps,
} from '../../constants/setup-bar-price.const';
import { BarPriceService } from '../../services/bar-price.service';
import { SetupBarPriceService } from '../../services/setup-bar-price.service';
import {
  BarPriceFormData,
  BarPricePlanFormControlName,
  ExtraBarPriceFormControlName,
  ExtraPlanConfigFormData,
  PlanConfigForm,
  PlanConfigFormGroup,
} from '../../types/setup-bar-price.types';
import { NewDataRecord } from 'libs/admin/shared/src/lib/types/fields.type';

@Component({
  selector: 'hospitality-bot-setup-bar-price',
  templateUrl: './setup-bar-price.component.html',
  styleUrls: ['./setup-bar-price.component.scss'],
})
export class SetupBarPriceComponent implements OnInit {
  readonly steps = setupBarPriceSteps;

  entityId: string;
  navRoutes: NavRouteOptions;
  loading: boolean;

  useForm: FormGroup;

  stepList: MenuItem[] = setupBarPriceSteps.map((item) => ({
    label: item.label,
  }));

  activeStep = 0;

  $subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private barPriceService: BarPriceService,
    private globalFilter: GlobalFilterService,
    private adminUtilityService: AdminUtilityService,
    private snackbarService: SnackBarService,
    private routeConfigService: RoutesConfigService,
    private setupBarPriceService: SetupBarPriceService
  ) {}

  ngOnInit(): void {
    this.initNavRoutes();
    this.initForm();
    this.initConfig();
  }

  initForm() {
    const extraPlanControlConfig: NewDataRecord<ExtraPlanConfigFormData> = {
      level: [],
      hotelTypeConfig: this.fb.array([]),
      roomTypeConfig: this.fb.array([]),
    };
    const extraPlanFG = this.fb.group(extraPlanControlConfig);

    const controlConfig: NewDataRecord<BarPriceFormData> = {
      extraBar: extraPlanFG,
      ratePlanBar: this.fb.array([]),
      roomOccupancyBar: this.fb.array([]),
      roomTypeBar: this.fb.array([]),
    };

    this.useForm = this.fb.group(controlConfig);

    this.useForm.valueChanges.subscribe((res) => {
      console.log(res, 'res');
    });
  }

  getExtraPlanFG() {}

  initConfig() {
    this.setupBarPriceService.initPlans();

    this.setupBarPriceService.getPlanConfiguration().subscribe((res) => {
      res['roomTypeBar'].forEach((plan, idx) => {
        this.createPlanFA(plan, 'roomTypeBar');
      });

      res['ratePlanBar'].forEach((plan, idx) => {
        this.createPlanFA(plan, 'ratePlanBar');
      });

      res['roomOccupancyBar'].forEach((plan, idx) => {
        this.createPlanFA(plan, 'roomOccupancyBar');
      });

      // this.initExtraPlanFormData(res['extraBar']);
    });
  }

  get useFromControl() {
    return this.useForm.controls as Record<keyof BarPriceFormData, FormArray>;
  }
  // get useFromControl() {
  //   return this.useForm.controls as Record<
  //     keyof BarPricePlanFormControlName,
  //     FormArray
  //   > &
  //     Record<ExtraBarPriceFormControlName, FormGroup>;
  // }

  initNavRoutes() {
    this.entityId = this.globalFilter.entityId;

    this.routeConfigService.navRoutesChanges.subscribe((navRoutes) => {
      this.navRoutes = [...navRoutes, { label: 'Setup Bar Price', link: './' }];
    });
  }

  // initExtraPlanFormData(data: ExtraPlanConfigFormData) {
  //   const dataa = this.useFromControl.extraBar.controls;
  // }

  createPlanFA(
    value: Partial<PlanConfigForm>,
    controlName: BarPricePlanFormControlName
  ) {
    const controlConfig: Record<keyof PlanConfigForm, any> = {
      name: [value.name],
      plan: [value.plan],
      parentPlan: [{ value: value.parentPlan, disabled: true }],
      currency: [value.currency],
      modifierPrice: [value.modifierPrice],
      modifierLevel: [value.modifierLevel],
    };

    const configForm = this.fb.group(controlConfig) as PlanConfigFormGroup;
    this.initPlanFromSubscription(configForm, controlName);

    // Pushing the FormArray Control
    this.useFromControl[controlName].push(configForm);
  }

  /**
   * Plan form subscription
   */
  initPlanFromSubscription(
    configForm: PlanConfigFormGroup,
    controlName: BarPricePlanFormControlName
  ) {
    const { modifierPrice, modifierLevel, parentPlan } = configForm.controls;

    const parentPlanModifierPriceControl = this.getPlanInputFromGroupControl(
      controlName
    ).find((item) => {
      return item.controls.plan.value === parentPlan.value;
    });

    const parentPlanModifierPrice =
      parentPlanModifierPriceControl?.controls.modifierPrice.value ?? 0;

    modifierPrice.valueChanges.subscribe((res) => {
      modifierLevel.setValue(res - parentPlanModifierPrice);
    });
  }

  getPlanInputFromGroupControl(controlName: BarPricePlanFormControlName) {
    return this.useFromControl[controlName].controls as PlanConfigFormGroup[];
  }

  listenChanges() {}

  handleNext() {
    this.activeStep = this.activeStep + 1;
  }

  handleBack() {
    this.activeStep = this.activeStep - 1;
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
