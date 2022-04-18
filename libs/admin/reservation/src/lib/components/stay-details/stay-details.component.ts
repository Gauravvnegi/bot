import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SubscriptionPlanService } from '@hospitality-bot/admin/core/theme';
import { get } from 'lodash';
import { GuestDetails } from '../../models/guest-feedback.model';
import { GuestReservation } from '../../models/guest-table.model';

@Component({
  selector: 'hospitality-bot-stay-details',
  templateUrl: './stay-details.component.html',
  styleUrls: ['./stay-details.component.scss'],
})
export class StayDetailsComponent implements OnInit {
  @Input('data') detailsData;
  @Input() parentForm: FormGroup;
  @Output() addFGEvent = new EventEmitter();
  @Output() isGuestInfoPatched = new EventEmitter();
  @Input() guestReservations;
  @Input() bookingNumber: string;
  @Input() feedbackId: string;
  @Input() colorMap;
  stayDetailsForm: FormGroup;
  constructor(
    private _fb: FormBuilder,
    private subscriptionService: SubscriptionPlanService
  ) {}

  ngOnInit(): void {}

  ngOnChanges() {
    if (this.detailsData) {
      this.addFormsControls();
      this.pushDataToForm();
    }
  }

  addFormsControls() {
    this.stayDetailsForm = this.initStayDetailsForm();
  }

  initStayDetailsForm() {
    return this._fb.group({
      arrivalDate: [''],
      departureDate: [''],
      expectedArrivalTime: [''],
      roomType: [''],
      kidsCount: [''],
      adultsCount: [''],
      roomNumber: [''],
      special_comments: [''],
      checkin_comments: [''],
    });
  }

  pushDataToForm() {
    this.stayDetailsForm.patchValue(this.detailsData.stayDetails);
    this.addFGEvent.next({ name: 'stayDetails', value: this.stayDetailsForm });
  }

  checkForTransactionFeedbackSubscribed() {
    const subscription = this.subscriptionService.getModuleSubscription();
    return get(subscription, ['modules', 'FEEDBACK_TRANSACTIONAL', 'active']);
  }

  checkForStayFeedbackSubscribed() {
    const subscription = this.subscriptionService.getModuleSubscription();
    return get(subscription, ['modules', 'feedback', 'active']);
  }
}
