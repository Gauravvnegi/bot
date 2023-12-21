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
import { setupBarPriceSteps } from '../../constants/setup-bar-price.const';
import { BarPriceService } from '../../services/bar-price.service';
import {
  BarPriceFormData,
  BarPricePlanFormControl,
} from '../../types/setup-bar-price.types';
import { BarPriceFormConfig } from '../bar-price-plan-from/bar-price-plan-form.component';
import { SetupBarPriceService } from '../../services/setup-bar-price.service';

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

  roomTypePlanConfiguration: BarPriceFormConfig;
  ratePlanConfiguration: BarPriceFormConfig;
  occupancyPlanConfiguration: BarPriceFormConfig;

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

  initConfig() {
    this.setupBarPriceService.getPlanConfiguration().subscribe((res) => {
      this.roomTypePlanConfiguration = {
        controlName: 'roomTypeBar',
        plan: res['roomTypeBar'],
        modifierPriceLabel: 'Base Rate',
        planTypeLabel: 'Room Type',
      };

      this.ratePlanConfiguration = {
        controlName: 'ratePlanBar',
        plan: res['ratePlanBar'],
      };

      this.occupancyPlanConfiguration = {
        controlName: 'roomOccupancyBar',
        plan: res['roomOccupancyBar'],
      };
    });
  }

  initForm() {
    const controlConfig: Record<keyof BarPriceFormData, FormArray> = {
      extraBar: this.fb.array([]),
      ratePlanBar: this.fb.array([]),
      roomOccupancyBar: this.fb.array([]),
      roomTypeBar: this.fb.array([]),
    };
    this.useForm = this.fb.group(controlConfig);

    this.useForm.valueChanges.subscribe((res) => {
      console.log(res, 'res');
    });
  }

  get useFromControl() {
    return this.useForm.controls as Record<keyof BarPriceFormData, FormArray>;
  }

  initNavRoutes() {
    this.entityId = this.globalFilter.entityId;

    this.routeConfigService.navRoutesChanges.subscribe((navRoutes) => {
      this.navRoutes = [...navRoutes, { label: 'Setup Bar Price', link: './' }];
    });
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
