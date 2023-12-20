import { Component } from '@angular/core';
import { ControlContainer, FormBuilder } from '@angular/forms';
import {
  GlobalFilterService,
  RoutesConfigService,
} from '@hospitality-bot/admin/core/theme';
import { AdminUtilityService } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { BarPriceService } from '../../services/bar-price.service';
import { BarPriceForm } from '../bar-price-from/bar-price-form.component';

@Component({
  selector: 'hospitality-bot-room-type-bar',
  templateUrl: './room-type-bar.component.html',
  styleUrls: ['../bar-price-from/bar-price-form.scss'],
})
export class RoomTypeBarComponent extends BarPriceForm {
  constructor(
    private fb: FormBuilder,
    private barPriceService: BarPriceService,
    private globalFilter: GlobalFilterService,
    private adminUtilityService: AdminUtilityService,
    private snackbarService: SnackBarService,
    private routeConfigService: RoutesConfigService,
    public controlContainer: ControlContainer
  ) {
    super(controlContainer);
    this.controlName = 'roomTypeBar';
  }

  registerListener(): void {
    console.log();
    this.inputControl.valueChanges.subscribe((res) => {
      console.log(res, 'roomType res');
    });
  }
}
