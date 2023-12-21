import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormArray,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import {
  BarPriceFormData,
  BarPricePlanFormControl,
  PlanConfigForm,
  PlanItems,
} from '../../types/setup-bar-price.types';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  ConfigService,
  FormGroupControls,
  Option,
} from '@hospitality-bot/admin/shared';

@Component({
  selector: 'hospitality-bot-bar-price-plan-form',
  templateUrl: './bar-price-plan-form.component.html',
  styleUrls: ['./bar-price-plan-form.scss'],
})
export class BarPricePlanForm implements OnInit, OnDestroy {
  $subscription = new Subscription();
  entityId: string;
  loading: boolean;
  inputControlArray: FormArray;
  controlName: BarPricePlanFormControl;
  plans: PlanItems;
  planOptions: Option[];
  isFormLoaded = false;

  planTypeLabel: BarPriceFormConfig['planTypeLabel'] = 'Rate Plan';
  modifierPriceLabel: BarPriceFormConfig['modifierPriceLabel'] =
    'Rate Plan Change';

  @Input() set formConfiguration({
    controlName,
    plan,
    modifierPriceLabel,
    planTypeLabel,
  }: BarPriceFormConfig) {
    this.plans = plan;

    this.planOptions = this.plans.map((item) => ({
      label: item.label,
      value: item.plan,
    }));

    if (modifierPriceLabel) {
      this.modifierPriceLabel = modifierPriceLabel;
    }

    if (planTypeLabel) {
      this.planTypeLabel = planTypeLabel;
    }

    this.controlName = controlName;
    this.initControl();
    this.isFormLoaded = true;
  }

  constructor(
    private configService: ConfigService,
    public controlContainer: ControlContainer,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {}

  initControl() {
    this.inputControlArray = this.controlContainer.control.get(
      this.controlName
    ) as FormArray;

    this.plans.forEach((plan, idx) => {
      this.createPlanFA(plan);
    });

    this.registerListener();
  }

  registerListener() {
    this.inputControlArray.valueChanges.subscribe((res) => {
      console.log(res, 'roomType res');
    });
  }

  createPlanFA(value: Partial<PlanConfigForm>) {
    const controlConfig: Record<keyof PlanConfigForm, any> = {
      plan: [value.plan],
      parentPlan: [{ value: value.parentPlan, disabled: true }],
      currency: [value.currency],
      modifierPrice: [value.modifierPrice],
      modifierLevel: [value.modifierLevel],
    };

    const configForm = this.fb.group(controlConfig) as PlanConfigFormGroup;
    this.initPlanFromSubscription(configForm);

    // Pushing the FormArray Control
    this.inputControlArray.push(configForm);
  }

  /**
   * Plan form subscription
   */
  initPlanFromSubscription(configForm: PlanConfigFormGroup) {
    const { modifierPrice, modifierLevel, parentPlan } = configForm.controls;

    const parentPlanModifierPriceControl = this.inputFromGroupControl.find(
      (item) => {
        return item.controls.plan.value === parentPlan.value;
      }
    );
    const parentPlanModifierPrice =
      parentPlanModifierPriceControl?.controls.modifierPrice.value ?? 0;
    modifierPrice.valueChanges.subscribe((res) => {
      modifierLevel.setValue(res - parentPlanModifierPrice);
    });
  }

  get inputFromGroupControl() {
    return this.inputControlArray.controls as PlanConfigFormGroup[];
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}

type PlanConfigFormGroup = FormGroup & FormGroupControls<PlanConfigForm>;

export type BarPriceFormConfig = {
  plan: PlanItems;
  controlName: BarPricePlanFormControl;
  planTypeLabel?: string;
  modifierPriceLabel?: string;
};
