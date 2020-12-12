import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ReservationDetails } from 'libs/web-user/shared/src/lib/data-models/reservationDetails';
import { StepperComponent } from 'libs/web-user/shared/src/lib/presentational/stepper/stepper.component';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';
import { ParentFormService } from 'libs/web-user/shared/src/lib/services/parentForm.service';
import {
  ITemplate,
  TemplateService,
} from 'libs/web-user/shared/src/lib/services/template.service';
import { forkJoin, of, Subscription } from 'rxjs';

@Component({
  selector: 'hospitality-bot-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  private $subscription: Subscription = new Subscription();
  @ViewChild('stepperComponent') stepperComponent: StepperComponent;

  stepperData: ITemplate;
  parentForm: FormArray = new FormArray([]);
  reservationData: ReservationDetails;
  isReservationData: boolean = false;

  constructor(
    private fb: FormBuilder,
    private _reservationService: ReservationService,
    private _parentFormService: ParentFormService,
    private _hotelService: HotelService,
    private _templateService: TemplateService
  ) {}

  ngOnInit(): void {
    this.getReservationDetails();
    this.registerListeners();
  }

  private getReservationDetails(): void {
    this.$subscription.add(
      forkJoin(
        this._reservationService.getReservationDetails(
          this._reservationService.reservationId
        ),
        of(true)
      ).subscribe(([reservationData, val]) => {
        this._hotelService.hotelConfig = reservationData['hotel'];
        this.isReservationData = true;
        this.stepperData = this._templateService.templateData;
        // TO_DO: Remove function call
        // this.stepperData = this.modifyStepperData(this._templateService.templateData);
        this.getStepperData();
        this.reservationData = reservationData;
        this._reservationService.reservationData = reservationData;
      })
    );
  }

  // TO-DO: Remove this function
  private modifyStepperData(data) {
    return {
      ...data,
      stepConfigs: data.stepConfigs
        .map((element) => {
          if (element.stepperName !== 'Payment') {
            return element;
          }
        })
        .filter(function (element) {
          return element !== undefined;
        }),
    };
  }

  private registerListeners() {
    this.$subscription.add(
      this.parentForm.valueChanges.subscribe((val) => {
        this._parentFormService.parentFormValueAndValidity$.next({
          parentForm: this.parentForm,
        });
      })
    );
  }

  private getStepperData() {
    // const data = {
    //   component: 'stepper',
    //   labelPosition: 'bottom',
    //   isLinear: false,
    //   position: 'horizontal',
    //   layout_variables: {
    //     '--stepper-dynamic-background-image':
    //       'linear-gradient(to left,#ffc837 , #ff8008)',
    //   },
    //   stepConfigs: [
    //     {
    //       stepperName: 'Stay Details',
    //       required: true,
    //       component: {
    //         name: 'stay-details-wrapper',
    //       },
    //       events: [],
    //       layout: {},
    //       editable: true,
    //       buttons: [
    //         {
    //           settings: {
    //             label: 'Next',
    //             isClickedTemplateSwitch: true,
    //           },
    //           name: 'next',
    //           buttonClass: 'next-button',
    //           click: {
    //             fn_name: ' ',
    //           },
    //         },
    //       ],
    //     },
    //     {
    //       stepperName: 'Guest Details',
    //       required: true,
    //       component: {
    //         name: 'guest-details-wrapper',
    //       },
    //       events: [],
    //       layout: {},
    //       editable: true,
    //       buttons: [
    //         {
    //           settings: {
    //             label: 'Back',
    //             isClickedTemplateSwitch: false,
    //           },
    //           name: 'back',
    //           buttonClass: 'back-button',
    //           click: {
    //             fn_name: 'goBack',
    //           },
    //         },
    //         {
    //           settings: {
    //             label: 'Next',
    //             isClickedTemplateSwitch: true,
    //           },
    //           name: 'next',
    //           buttonClass: 'next-button',
    //           click: {
    //             fn_name: 'saveGuestDetails',
    //           },
    //         },
    //       ],
    //     },
    //     {
    //       stepperName: 'Documentation',
    //       required: true,
    //       component: {
    //         name: 'document-details-wrapper',
    //       },
    //       events: [],
    //       layout: {},
    //       editable: true,
    //       buttons: [
    //         {
    //           settings: {
    //             label: 'Back',
    //             isClickedTemplateSwitch: false,
    //           },
    //           name: 'back',
    //           buttonClass: 'back-button',
    //           click: {
    //             fn_name: 'goBack',
    //           },
    //         },
    //         {
    //           settings: {
    //             label: 'Next',
    //             isClickedTemplateSwitch: true,
    //           },
    //           name: 'next',
    //           buttonClass: 'next-button',
    //           click: {
    //             fn_name: 'saveDocumentDetails',
    //           },
    //         },
    //       ],
    //     },
    //     {
    //       stepperName: 'Health Declaration Form',
    //       required: false,
    //       component: {
    //         name: 'health-declaration-wrapper',
    //       },
    //       events: [],
    //       layout: {},
    //       editable: true,
    //       buttons: [
    //         {
    //           settings: {
    //             label: 'Back',
    //             isClickedTemplateSwitch: false,
    //           },
    //           name: 'back',
    //           buttonClass: 'back-button',
    //           click: {
    //             fn_name: 'goBack',
    //           },
    //         },
    //         {
    //           settings: {
    //             label: 'Next',
    //             isClickedTemplateSwitch: true,
    //           },
    //           name: 'next',
    //           buttonClass: 'next-button',
    //           click: {
    //             fn_name: 'saveHealthDeclarationDetails',
    //           },
    //         },
    //       ],
    //     },
    //     {
    //       stepperName: 'Feedback',
    //       required: true,
    //       component: {
    //         name: 'feedback-details-wrapper',
    //       },
    //       events: [],
    //       layout: {},
    //       editable: true,
    //       buttons: [],
    //     },
    //     {
    //       stepperName: 'Payment',
    //       required: true,
    //       component: {
    //         name: 'payment-details-wrapper',
    //       },
    //       events: [],
    //       layout: {},
    //       editable: true,
    //       buttons: [
    //         {
    //           settings: {
    //             label: 'Back',
    //             isClickedTemplateSwitch: false,
    //           },
    //           name: 'back',
    //           buttonClass: 'back-button',
    //           click: {
    //             fn_name: 'goBack',
    //           },
    //         },
    //         {
    //           settings: {
    //             label: 'Submit',
    //             isClickedTemplateSwitch: true,
    //           },
    //           name: 'submit',
    //           buttonClass: 'next-button',
    //           click: {
    //             fn_name: 'onSubmit',
    //           },
    //         },
    //       ],
    //     },
    //     {
    //       stepperName: 'Bill Summary',
    //       required: true,
    //       component: {
    //         name: 'bill-summary-details-wrapper',
    //       },
    //       events: [],
    //       layout: {},
    //       editable: true,
    //       buttons: [],
    //     },
    //     {
    //       stepperName: 'Summary',
    //       required: true,
    //       component: {
    //         name: 'summary-wrapper',
    //       },
    //       events: [],
    //       layout: {},
    //       editable: true,
    //       buttons: [],
    //     },
    //   ],
    // };
    // this.stepperData = data;
    this.initStepperParentFG();
    return true;
  }

  private initStepperParentFG(): void {
    this.stepperData.stepConfigs.forEach((stepConfig) => {
      const group: FormGroup = this.fb.group({});
      this.parentForm.push(group);
    });
  }
}
