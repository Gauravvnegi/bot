import { Injectable } from '@angular/core';
import { OutletForm, OutletFormData } from '../types/outlet';

export class OutletFormService {
  OutletFormData: Partial<OutletFormData> = {
    paidServiceIds: [],
    serviceIds: [],
    menuIds: [],
    foodPackageIds: [],
  };
  Outlet: any = 'RESTAURANT';

  outletFormState: boolean = false;

  initOutletFormData(input: Partial<OutletForm>, outletFormState: boolean) {
    this.OutletFormData = { ...this.OutletFormData, ...input };
    this.outletFormState = outletFormState;
  }

  resetOutletFormData() {
    this.OutletFormData = {};
    this.OutletFormData = {
      paidServiceIds: [],
      serviceIds: [],
      menuIds: [],
      foodPackageIds: [],
    };
    this.outletFormState = false;
  }
}
