import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IteratorField } from 'libs/admin/shared/src/lib/types/fields.type';
import { FormProps, NavRouteOptions } from 'libs/admin/shared/src';

@Component({
  selector: 'hospitality-bot-add-reservation',
  templateUrl: './add-reservation.component.html',
  styleUrls: ['./add-reservation.component.scss'],
})
export class AddReservationComponent implements OnInit {
  useForm: FormGroup;
  useFormArray: FormArray;
  roomFields: IteratorField[] = [
    {
      label: 'Room Type',
      name: 'roomType',
      type: 'select',
      options: [],
      required: false,
    },
    {
      label: 'Number of rooms',
      name: 'noRoom',
      type: 'input',
      required: true,
    },
    {
      label: 'Adult',
      name: 'adults',
      type: 'input',
      required: true,
    },
    {
      label: 'Kids',
      name: 'kids',
      type: 'input',
      required: true,
    },
  ];

  options = [
    { label: 'Admin', value: 'Admin' },
    { label: 'Botshot', value: 'Botshot' },
  ];

  paymentOptions = [
    { label: 'Razor Pay', value: 'RAZOR_PAY' },
    { label: 'Cash', value: 'CASH' },
    { label: 'Stripe', value: 'STRIPE' },
    { label: 'POS Payment', value: 'POS_PAYMENT' },
  ];

  reservationTypes = [
    { label: 'Draft', value: 'Draft' },
    { label: 'Confirmed', value: 'Confirmed' },
    { label: 'Cancelled', value: 'Cancelled' },
  ];

  bookingSources = [
    { label: 'OTA', value: 'OTA' },
    { label: 'Agent', value: 'Agent' },
    { label: 'Walk-In', value: 'Walk-In' },
    { label: 'Offline-sales', value: 'Offline-sales' },
  ];

  marketSegments = [
    { label: 'Leisure', value: 'Leisure' },
    { label: 'Corporate', value: 'Corporate' },
    { label: 'Social', value: 'Social' },
  ];

  routes: NavRouteOptions = [
    { label: 'eFrontdesk', link: '../dashboard' },
    { label: 'Add Reservation', link: './' },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  props: FormProps = {
    // variant: 'standard',
    // alignment: 'vertical',
  };

  /**
   * @function initForm Initialize form
   */
  initForm(): void {
    this.useFormArray = this.fb.array([]);

    this.useForm = this.fb.group({
      bookingInformation: this.fb.group({
        checkIn: ['', Validators.required],
        checkOut: ['', Validators.required],
        reservationType: ['', Validators.required],
        bookingSource: ['', Validators.required],
        businessSource: ['', Validators.required],
        marketSource: ['', Validators.required],
      }),
      roomInformation: this.useFormArray,
      guestInformation: this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', Validators.required],
        phoneNumber: ['', Validators.required],
      }),
      billingAddress: this.fb.group({
        city: ['', Validators.required],
        country: ['', Validators.required],
        address: ['', Validators.required],
        state: ['', Validators.required],
        postalCode: ['', Validators.required],
      }),
      paymentMethod: this.fb.group({
        paymentOption: ['', Validators.required],
        remarks: ['', Validators.required],
      }),
    });
  }
}
