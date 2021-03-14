import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAccordion, MatExpansionPanel } from '@angular/material/expansion';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';
import { customPatternValid } from 'libs/web-user/shared/src/lib/services/validator.service';
import { Subscription } from 'rxjs';
import { GuestDetailsConfigI } from '../../../../../../shared/src/lib/data-models/guestDetailsConfig.model';
import { Regex } from '../../../../../../shared/src/lib/data-models/regexConstant';
import { GuestDetailsService } from './../../../../../../shared/src/lib/services/guest-details.service';

@Component({
  selector: 'hospitality-bot-guest-details',
  templateUrl: './guest-details.component.html',
  styleUrls: ['./guest-details.component.scss'],
})
export class GuestDetailsComponent implements OnInit, OnChanges {
  protected $subscription: Subscription = new Subscription();
  @ViewChild('guestAccordian') guestAccordian: MatAccordion;

  @ViewChildren('guestpanel')
  guestPanelList: QueryList<MatExpansionPanel>;

  @Input() guestType: string;
  @Input() parentForm: FormGroup;
  @Input() reservationData;

  @Output()
  addFGEvent = new EventEmitter();

  guestDetailsForm: FormGroup;
  guestFieldConfig: GuestDetailsConfigI[] = [];

  constructor(
    protected _fb: FormBuilder,
    protected _guestDetailService: GuestDetailsService,
    protected _hotelService: HotelService
  ) {
    this.initGuestDetailForm();
  }

  ngOnChanges() {
    this.setGuestDetails();
  }

  ngOnInit(): void {
    this.registerListeners();
  }

  /**
   * Initialize form
   */
  initGuestDetailForm() {
    this.guestDetailsForm = this._fb.group({
      guests: new FormArray([]),
    });
  }

  getGuestFG(): FormGroup {
    return this._fb.group({
      id: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', []],
      mobileNumber: [
        '',
        [
          Validators.required,
          customPatternValid({
            pattern: Regex.PHONE_REGEX,
            msg: 'Please enter a valid mobile',
          }),
          Validators.minLength(10),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          customPatternValid({
            pattern: Regex.EMAIL_REGEX,
            msg: 'Please enter a valid email',
          }),
        ],
      ],
      nameTitle: ['Mr.', [Validators.required]],
      nationality: ['', [Validators.required]],
      label: [''],
      type: [''],
      role: [''],
    });
  }

  setFieldConfiguration() {
    return this._guestDetailService.setFieldConfigForGuestDetails({
      hotelNationality: this._hotelService.hotelConfig.address.countryCode,
    });
  }

  setGuestDetails() {
    if (this.reservationData) {
      if (this._guestDetailService.guestDetails.guests.length) {
        this.addGuests();
      }
      this.addFGEvent.next({
        name: 'guestDetail',
        value: this.guestDetailsForm,
      });

      this.guestDetailsForm.patchValue(this._guestDetailService.guestDetails);
    }
  }

  addGuests() {
    this._guestDetailService.guestDetails.guests.forEach((guestDetail) => {
      let controlFA = this.guestDetailsForm.get('guests') as FormArray;
      controlFA.push(this.getGuestFG());
      this.guestFieldConfig.push(this.setFieldConfiguration());
    });
  }

  registerListeners() {
    this.listenForStayDetailDSchange();
  }

  listenForStayDetailDSchange() {
    this.$subscription.add(
      this._guestDetailService.guestDetailDS$.subscribe((value) => {
        this.guestDetailsForm.patchValue(this._guestDetailService.guestDetails);
      })
    );
  }

  get guests(): FormArray {
    return this.guestDetailsForm.get('guests') as FormArray;
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
