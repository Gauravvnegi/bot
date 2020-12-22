import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FeedbackDetailsConfigI } from './../../../../../../shared/src/lib/data-models/feedbackDetailsConfig.model';
import { FeedbackDetailsService } from './../../../../../../shared/src/lib/services/feedback-details.service';

@Component({
  selector: 'hospitality-bot-feedback-details',
  templateUrl: './feedback-details.component.html',
  styleUrls: ['./feedback-details.component.scss'],
})
export class FeedbackDetailsComponent implements OnInit {
  @Input() parentForm: FormGroup;
  @Input() reservationData;

  @Output()
  addFGEvent = new EventEmitter();

  feedbackDetailsForm: FormGroup;
  feedbackDetailsConfig: FeedbackDetailsConfigI;
  title: string;
  ratingScale: number[];
  suggestionArray = new Array<any>();
  ratingScaleConfig;

  constructor(
    private _fb: FormBuilder,
    private _feedbackDetailsService: FeedbackDetailsService
  ) {
    this.initFeedBackDetailForm();
  }

  ngOnInit(): void {
    this.ratingScale = this.ratingScaleRange;
    this.ratingScaleConfig = this.ratingConfig;
    this._feedbackDetailsService.selectedServices = this.suggestionArray;

    this.setfeedbackDetails();
  }

  /**
   * Initialize form
   */
  initFeedBackDetailForm() {
    this.feedbackDetailsForm = this._fb.group({
      feedback: [''],
      rating: ['', [Validators.required]],
    });
  }

  setFieldConfiguration(feedbackText) {
    return this._feedbackDetailsService.setFieldConfigForFeedbackDetails(
      feedbackText
    );
  }

  SetHotelServices(event) {
    let serviceIndex = this.suggestionArray.findIndex(
      (suggestion) => suggestion.serviceId === event.id
    );
    if (serviceIndex < 0) {
      this.suggestionArray.push({
        serviceId: event.id,
        serviceName: event.label,
      });
    } else {
      this.suggestionArray.splice(serviceIndex, 1);
    }
    this._feedbackDetailsService.selectedServices = this.suggestionArray;
  }

  setRating(event) {
    this.rating.patchValue(event);
    let feedbackText;
    if (event <= this.ratingScale.length / 2) {
      this.title =
        this._feedbackDetailsService.feedbackConfigDS &&
        this._feedbackDetailsService.feedbackConfigDS.feedBackConfig
          .negativeTitle;
      feedbackText = 'Tell us what went wrong';
    } else {
      this.title =
        this._feedbackDetailsService.feedbackConfigDS &&
        this._feedbackDetailsService.feedbackConfigDS.feedBackConfig
          .positiveTitle;
      feedbackText = 'Tell us what did you like';
    }
    this.feedbackDetailsConfig = this.setFieldConfiguration(feedbackText);
  }

  setfeedbackDetails() {
    if (this.reservationData) {
      this.addFGEvent.next({
        name: 'feedbackDetail',
        value: this.feedbackDetailsForm,
      });
    }
  }

  get ratingConfig() {
    return (
      this._feedbackDetailsService.feedbackConfigDS &&
      this._feedbackDetailsService.feedbackConfigDS.feedBackConfig
        .ratingScaleConfig
    );
  }

  get hotelServices() {
    return (
      this._feedbackDetailsService.feedbackConfigDS &&
      this._feedbackDetailsService.feedbackConfigDS.feedBackConfig.suggestions
    );
  }

  get ratingScaleRange() {
    return (
      this._feedbackDetailsService.feedbackConfigDS &&
      this._feedbackDetailsService.feedbackConfigDS.feedBackConfig.ratingScale
    );
  }

  get rating() {
    return this.feedbackDetailsForm.get('rating');
  }
}
