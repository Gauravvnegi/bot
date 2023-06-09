import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup } from '@angular/forms';
import { NavRouteOptions, Option } from '@hospitality-bot/admin/shared';

@Component({
  selector: 'hospitality-bot-add-outlet',
  templateUrl: './add-outlet.component.html',
  styleUrls: ['./add-outlet.component.scss'],
})
export class AddOutletComponent implements OnInit {
  pageTitle: string = 'Add Outlet';
  navRoutes: NavRouteOptions = [];
  useForm: FormGroup;
  type: Option[] = [
    { label: 'Restaurant & Bar', value: 'restaurant' },
    { label: 'Spa', value: 'spa' },
    { label: 'Banquet', value: 'banquet' },
  ];

  subType: Option[] = [
    { label: 'Resturant', value: 'fineDining' },
    { label: 'Bar', value: 'casualDining' },
    { label: 'Cafe', value: 'cafe' },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.useForm = this.fb.group({
      name: [''],
      type: [[]],
      subType: [[]],
      contact: this.fb.group({
        countryCode: [''],
        number: [''],
      }),
      address: [[]],
      imageUrl: [[]],
      description: [''],
      rules: [[]],
      serviceIds: [[]],
      menu: [[]],
      socialMedia: [[]],
      maxOccupancy: [''],
      area: [''],
    });
  }

  resetForm(): void {
    this.useForm.reset();
  }

  submitForm(): void {
    console.log(this.useForm.getRawValue());
  }
}
