import { Component, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

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
      countryCode: ['', [Validators.required]],
      state: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
    };
    
    this.parentFormGroup.addControl('address', this.fb.group(data));
  }
}
