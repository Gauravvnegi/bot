import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, ControlContainer, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BarPriceFromData } from '../../types/setup-bar-price.types';

@Component({ template: '' })
export class BarPriceForm implements OnInit, OnDestroy {
  $subscription = new Subscription();
  entityId: string;
  loading: boolean;
  inputControl: FormArray;
  controlName: keyof BarPriceFromData;

  constructor(public controlContainer: ControlContainer) {}

  ngOnInit(): void {
    this.initControl();
    this.registerListener();
  }

  initControl() {
    this.inputControl = this.controlContainer.control.get(
      this.controlName
    ) as FormArray;
  }

  registerListener() {
    // Override to initiate function call that are to be run on ngOnIt
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
