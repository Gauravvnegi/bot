import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { combineLatest, Subject } from 'rxjs';
import { IFeedbackConfig } from '../../types/feedback';
import { FeedbackDetailsService } from './../../../../../../shared/src/lib/services/feedback-details.service';
export enum RatingEntities {
  'Hotel' = 'Hotel',
  'Department' = 'Department',
  'Service' = 'Service',
  'Touchpoint' = 'Touchpoint',
}
export type RatingEntity = keyof typeof RatingEntities;
export enum RatingTypes {
  'Positive' = 'Positive',
  'Negative' = 'Negative',
}
export type RatingType = keyof typeof RatingTypes;
@Component({
  selector: 'hospitality-bot-feedback-details',
  templateUrl: './feedback-details.component.html',
  styleUrls: ['./feedback-details.component.scss'],
})
export class FeedbackDetailsComponent implements OnInit {
  @Input() parentForm: FormGroup;
  @Input() reservationData;
  @Input() feedbackConfig: IFeedbackConfig;

  @Output()
  addFGEvent = new EventEmitter();

  feedbackDetailsForm: FormGroup;
  feedbackDetailsConfig;

  ratingQuestion: {
    hotel;
    department;
    service;
  };

  selectedQuickServices = new Array<any>();

  constructor(
    private _fb: FormBuilder,
    private _feedbackDetailsService: FeedbackDetailsService
  ) {
    this.initFeedBackDetailForm();
  }

  ngOnInit(): void {
    this.setfeedbackDetails();
  }

  initFeedBackDetailForm() {
    this.feedbackDetailsForm = this._fb.group({
      feedback: [''],
      rating: ['', [Validators.required]],
    });
  }

  setHotelServices(service) {
    let serviceIndex = this.selectedQuickServices.findIndex(
      (suggestion) => suggestion.serviceId === service.id
    );
    if (serviceIndex < 0) {
      this.selectedQuickServices.push({
        serviceId: service.id,
        serviceName: service.label,
      });
    } else {
      this.selectedQuickServices.splice(serviceIndex, 1);
    }
  }

  onRatingSelection(
    { rating },
    ratingEntity: RatingEntity,
    formGroups?: FormGroup[]
  ) {
    switch (ratingEntity) {
      case 'Hotel': {
        this.setRatingQuestion(rating);
        break;
      }
      case 'Touchpoint': {
        const [departmentFG, serviceFG, touchPointFG] = formGroups;
        this.setTouchpointFeedback(departmentFG, serviceFG, touchPointFG);
      }
    }
  }

  setTouchpointFeedback(
    departmentFG: FormGroup,
    serviceFG: FormGroup,
    touchPointFG: FormGroup
  ) {
    touchPointFG.get('isSelected').patchValue(true);
    serviceFG.get('isSelected').patchValue(true);
    departmentFG.get('isSelected').patchValue(true);
  }

  removeFeedback(event, ratingEntity: RatingEntity, formGroups: FormGroup[]) {
    switch (ratingEntity) {
      case 'Department': {
        const [departmentFG] = formGroups;

        departmentFG && this.resetDepartment(departmentFG, 'Force');
        break;
      }
      case 'Service': {
        const [departmentFG, serviceFG] = formGroups;

        serviceFG && this.resetService(serviceFG, 'Force');
        departmentFG && this.resetDepartment(departmentFG, 'Manual');
      }
      case 'Touchpoint': {
        const [departmentFG, serviceFG, touchPointFG] = formGroups;

        touchPointFG && this.resetTouchpoint(touchPointFG);
        serviceFG && this.resetService(serviceFG, 'Manual');
        touchPointFG && this.resetDepartment(departmentFG, 'Manual');
      }
    }
  }

  resetTouchpoint(touchPointFG) {
    touchPointFG.patchValue({ isSelected: false, rating: 0 });
  }

  resetService(serviceFG: FormGroup, type: 'Manual' | 'Force') {
    if (type == 'Manual') {
      const touchPointFA = serviceFG.get('touchPoints') as FormArray;
      let isAnyTouchPointSelected = false;
      for (let touchPointFG of touchPointFA.controls) {
        isAnyTouchPointSelected = touchPointFG.get('isSelected').value;
        if (isAnyTouchPointSelected) {
          break;
        }
      }

      if (!isAnyTouchPointSelected) {
        serviceFG.patchValue({ isSelected: false });
      }
    } else if (type == 'Force') {
      serviceFG.patchValue({ isSelected: false });

      const touchPointFA = serviceFG.get('touchPoints') as FormArray;
      touchPointFA.controls.forEach((touchpointFG: FormGroup) => {
        this.resetTouchpoint(touchpointFG);
      });
    }
  }

  resetDepartment(departmentFG: FormGroup, type: 'Manual' | 'Force') {
    if (type == 'Manual') {
      const serviceFA = departmentFG
        .get('serviceForm')
        .get('services') as FormArray;
      let isAnyServiceSelected = false;
      for (let serviceFG of serviceFA.controls) {
        isAnyServiceSelected = serviceFG.get('isSelected').value;
        if (isAnyServiceSelected) {
          break;
        }
      }

      if (!isAnyServiceSelected) {
        departmentFG.patchValue({ isSelected: false });
      }
    } else if (type == 'Force') {
      departmentFG.patchValue({ isSelected: false });

      const serviceFA = departmentFG
        .get('serviceForm')
        .get('services') as FormArray;
      serviceFA.controls.forEach((serviceFG: FormGroup) => {
        this.resetService(serviceFG, 'Force');
      });
    }
  }

  setRatingQuestion(rating) {
    let ratingType: RatingType =
      rating <= this.feedbackConfig.ratingScale.length / 2
        ? RatingTypes.Negative
        : RatingTypes.Positive;

    const {
      hotelRatingQuestion,
      departmentRatingQuestion,
      serviceRatingQuestion,
    } = this.feedbackConfig;

    switch (ratingType) {
      case 'Positive':
        this.ratingQuestion = {
          hotel: hotelRatingQuestion.positiveLabel,
          department: departmentRatingQuestion.positiveLabel,
          service: serviceRatingQuestion.positiveLabel,
        };

        break;

      case 'Negative':
        this.ratingQuestion = {
          hotel: hotelRatingQuestion.negativeLabel,
          department: departmentRatingQuestion.negativeLabel,
          service: serviceRatingQuestion.negativeLabel,
        };

        break;
    }
    this.feedbackDetailsConfig = {
      ...this._feedbackDetailsService.setFieldConfigForFeedbackDetails({
        hotelRatingQuestion: this.ratingQuestion.hotel,
        departmentRatingQuestion: this.ratingQuestion.department,
        serviceRatingQuestion: this.ratingQuestion.service,
      }),
    };
  }

  setfeedbackDetails() {
    if (this.reservationData) {
      if (this.feedbackConfig.departments.length) {
        this.feedbackDetailsForm.addControl(
          'departmentForm',
          this._fb.group({
            departments: this._fb.array([]),
            feedback: [''],
            rating: [''],
            isSelected: [''],
          })
        );
        const departmentsFA = this.feedbackDetailsForm
          .get('departmentForm')
          .get('departments') as FormArray;
        this.feedbackConfig.departments.forEach((department, deptIdx) => {
          departmentsFA.push(
            this._fb.group({
              id: [`${department.id}`],
              isSelected: [false],
              label: [department.label],
              serviceForm: this._fb.group({
                services: this._fb.array([]),
                feedback: [''],
                rating: [''],
                isSelected: [''],
              }),
            })
          );

          if (department.departmentServices.length) {
            const serviceFA = departmentsFA
              .at(deptIdx)
              .get('serviceForm')
              .get('services') as FormArray;
            department.departmentServices.forEach((service, serviceIdx) => {
              serviceFA.push(
                this._fb.group({
                  id: [service.id],
                  isSelected: [false],
                  label: [service.label],
                  feedback: [''],
                  touchPoints: this._fb.array([]),
                })
              );

              if (service.serviceTouchpoints.length) {
                const touchPointFA = serviceFA
                  .at(serviceIdx)
                  .get('touchPoints') as FormArray;

                service.serviceTouchpoints.forEach((touchPoint) => {
                  touchPointFA.push(
                    this._fb.group({
                      id: [touchPoint.id],
                      isSelected: [false],
                      label: [touchPoint.label],
                      rating: [''],
                    })
                  );
                });
              }
            });
          }
        });
      }

      this.addFGEvent.next({
        name: 'feedbackDetail',
        value: this.feedbackDetailsForm,
      });
    }
  }

  get rating() {
    return this.feedbackDetailsForm.get('rating');
  }

  get departmentsFA() {
    return this.feedbackDetailsForm
      .get('departmentForm')
      .get('departments') as FormArray;
  }

  get departmentFG() {
    return this.feedbackDetailsForm.get('departmentForm') as FormGroup;
  }
}
