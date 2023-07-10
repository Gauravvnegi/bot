import { Injectable } from '@angular/core';
import { OutletForm } from '../types/outlet';

@Injectable()
export class OutletFormService {
  OutletFormData: Partial<OutletForm> = {};

  outletFormState: boolean = false;

  initOutletFormData(input: Partial<OutletForm>, outletFormState: boolean) {
    this.OutletFormData = { ...this.OutletFormData, ...input };
    this.outletFormState = outletFormState;
  }

  resetOutletFormData() {
    this.OutletFormData = {};
    this.outletFormState = false;
  }
}
