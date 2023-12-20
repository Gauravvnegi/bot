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
import { BarPriceFromData } from '../../types/setup-bar-price.types';

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
    private routeConfigService: RoutesConfigService
  ) {}

  ngOnInit(): void {
    this.initNavRoutes();
    this.initForm();
  }

  initForm() {
    const controlConfig: Record<keyof BarPriceFromData, FormArray> = {
      extrasBar: this.fb.array([]),
      ratePlanBar: this.fb.array([]),
      roomOccupancyBar: this.fb.array([]),
      roomTypeBar: this.fb.array([]),
    };
    this.useForm = this.fb.group(controlConfig);

    this.createRoomTypeBar();

    this.useForm.valueChanges.subscribe((res) => {
      console.log(res, 'res');
    });
  }

  createRoomTypeBar() {
    const controlConfig: Record<keyof BarPriceFromData['roomTypeBar'], any> = {
      baseRate: [],
      modifierLevel: [],
      parent: [],
      roomType: [],
    };

    this.useFromControl.roomTypeBar.push(this.fb.group(controlConfig));
  }

  get useFromControl() {
    return this.useForm.controls as Record<keyof BarPriceFromData, FormArray>;
  }

  initNavRoutes() {
    this.entityId = this.globalFilter.entityId;

    this.routeConfigService.navRoutesChanges.subscribe((navRoutes) => {
      this.navRoutes = [...navRoutes, { label: 'Setup Bar Price', link: './' }];
    });
  }

  listenChanges() {}

  handleNext() {}

  handleBack() {}

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
