import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ReservationForm } from '../../../constants/form';
import { AddressData } from '@hospitality-bot/admin/shared';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'hospitality-bot-billing-address',
  templateUrl: './billing-address.component.html',
  styleUrls: [
    './billing-address.component.scss',
    '../../reservation.styles.scss',
  ],
})
export class BillingAddressComponent implements OnInit {
  parentFormGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    public controlContainer: ControlContainer
  ) {}

  ngOnInit(): void {
    this.addFormGroup();
  }

  addFormGroup() {
    this.parentFormGroup = this.controlContainer.control as FormGroup;

    const data = {
      addressLine1: ['', [Validators.required]],
      city: ['', [Validators.required]],
      country: ['', [Validators.required]],
      state: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
    };

    this.parentFormGroup.addControl('address', this.fb.group(data));
    this.extractAddress();
  }

  extractAddress() {
    this.inputControl.addressLine1.valueChanges.subscribe(
      (res: AddressData) => {
        if (res) {
          const { city, state, country, postalCode, ...remainingAddress } = res;
          this.inputControl.city.setValue(city);
          this.inputControl.state.setValue(state);
          this.inputControl.country.setValue(country);
          this.inputControl.postalCode.setValue(postalCode);
        }
      }
    );
  }

  get inputControl() {
    return (this.parentFormGroup.get('address') as FormGroup)
      .controls as Record<keyof ReservationForm['address'], AbstractControl>;
  }
}
