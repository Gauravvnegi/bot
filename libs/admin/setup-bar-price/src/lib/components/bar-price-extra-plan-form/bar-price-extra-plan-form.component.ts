import { Component, OnDestroy, OnInit } from '@angular/core';
import { ControlContainer, FormBuilder } from '@angular/forms';
import { ConfigService } from '@hospitality-bot/admin/shared';
import { Subscription } from 'rxjs';
import { ExtraBarPriceFormControlName } from '../../types/setup-bar-price.types';

@Component({
  selector: 'hospitality-bot-bar-price-extra-plan-form',
  templateUrl: './bar-price-extra-plan-form.component.html',
  styleUrls: ['./bar-price-extra-plan-form.scss'],
})
export class BarPriceExtraPlanForm implements OnInit, OnDestroy {
  $subscription = new Subscription();

  controlName: ExtraBarPriceFormControlName;

  constructor(
    private configService: ConfigService,
    public controlContainer: ControlContainer,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {}

  initControl() {
    this.registerListener();
  }

  registerListener() {}

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
