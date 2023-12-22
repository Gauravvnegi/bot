import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlContainer, FormArray } from '@angular/forms';
import { ConfigService, Option } from '@hospitality-bot/admin/shared';
import { Subscription } from 'rxjs';
import { SetupBarPriceService } from '../../services/setup-bar-price.service';
import {
  BarPricePlanFormControlName,
  PlanConfigFormGroup,
} from '../../types/setup-bar-price.types';

@Component({
  selector: 'hospitality-bot-bar-price-plan-form',
  templateUrl: './bar-price-plan-form.component.html',
  styleUrls: ['./bar-price-plan-form.scss'],
})
export class BarPricePlanForm implements OnInit, OnDestroy {
  $subscription = new Subscription();

  inputControl: FormArray;
  @Input() controlName: BarPricePlanFormControlName;

  planOptions: Option[] = [];
  currencies: Option[] = [];

  planTypeLabel: BarPriceFormConfig['planTypeLabel'] = 'Rate Plan';
  modifierPriceLabel: BarPriceFormConfig['modifierPriceLabel'] =
    'Rate Plan Change';

  @Input() set formConfiguration(value: BarPriceFormConfig) {
    Object.entries(value)?.forEach(([key, value]) => {
      this[key] = value;
    });
  }

  constructor(
    private configService: ConfigService,
    public controlContainer: ControlContainer,
    private setupBarPriceService: SetupBarPriceService
  ) {}

  ngOnInit(): void {
    this.initControl();
    this.initOptions();
  }

  initControl() {
    this.inputControl = this.controlContainer.control.get(
      this.controlName
    ) as FormArray;

    this.registerListener();
  }

  initOptions() {
    this.setupBarPriceService[this.controlName].subscribe((res) => {
      this.planOptions = res;
    });

    this.currencies = this.configService.currency;
  }

  registerListener() {
    this.inputControl.valueChanges.subscribe((res) => {
      console.log(res, 'roomType res');
    });
  }

  get inputArrayControl() {
    return this.inputControl.controls as PlanConfigFormGroup[];
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}

export type BarPriceFormConfig = {
  planTypeLabel?: string;
  modifierPriceLabel?: string;
};
