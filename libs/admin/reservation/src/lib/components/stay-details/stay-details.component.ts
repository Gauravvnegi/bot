import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SubscriptionPlanService } from '@hospitality-bot/admin/core/theme';
import { get } from 'lodash';
import { VisitDetails } from '../../models/guest-feedback.model';
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
  guestReservations;
  stayDetailsForm: FormGroup;
  constructor(
    private _fb: FormBuilder,
    private subscriptionService: SubscriptionPlanService
  ) {}

  ngOnInit(): void {
    this.guestReservations = new VisitDetails().deserialize(
      this.mockData(),
      this.checkForStayFeedbackSubscribed() ||
        this.checkForTransactionFeedbackSubscribed()
    );
    console.log(this.guestReservations);
  }

  mockData() {
    // if (this.checkForStayFeedbackSubscribed())
    //   return [
    //     {
    //       id: '5c5aa0c8-79ca-43c5-8cb4-6e8a3f735edc',
    //       arrivalTime: 1648680612000,
    //       departureTime: 1648853412000,
    //       number: '30652',
    //       pmsStatus: 'RESERVED',
    //       state: 'PRECHECKIN',
    //       stateCompletedSteps: 5,
    //       stayDetails: {
    //         statusMessage: {
    //           code: 0,
    //           status: 'COMPLETED',
    //           state: 'ACCEPT',
    //           remarks: null,
    //         },
    //         arrivalTime: 1648680612000,
    //         departureTime: 1648853412000,
    //         expectedArrivalTime: 1648680612000,
    //         expectedDepartureTime: 1648853412000,
    //         roomType: 'BKX',
    //         adultsCount: 1,
    //         kidsCount: 0,
    //         comments: '',
    //         roomNumber: 0,
    //         checkInComment: '',
    //         status: '',
    //       },
    //       visitDetails: {
    //         statusMessage: {
    //           code: 0,
    //           status: 'PENDING',
    //           state: 'PENDING',
    //           remarks: null,
    //         },
    //         feedbackSubmissionTime: 1648560600000,
    //         intentToRecommends: 5,
    //         serviceType: null,
    //         marketSegment: 'Leisure',
    //         comment: {
    //           question:
    //             "We are thrilled you feel that way. What's the main reason for your score?",
    //           answer:
    //             "orem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    //         },
    //         feedbackId: '23e2dd62-fb99-4ef8-92d6-a2c554a692ef',
    //         feedbackType: null,
    //         surveyType: null,
    //         outletId: null,
    //       },
    //       guestAttributes: {
    //         overAllNps: 0.0,
    //         totalSpend: 0.0,
    //         churnProbalilty: 0.0,
    //         numberOfBookings: 0,
    //       },
    //       vip: false,
    //       bookingType: 'UPCOMING',
    //       type: 'BOOKING',
    //     },
    //     {
    //       id: 'dc15afc7-ad45-49a6-b857-a38e45235c2b',
    //       arrivalTime: 1648560600000,
    //       departureTime: 1647196200000,
    //       number: '30403',
    //       pmsStatus: 'RESERVED',
    //       state: 'PRECHECKIN',
    //       stateCompletedSteps: 3,
    //       stayDetails: {
    //         statusMessage: {
    //           code: 0,
    //           status: 'COMPLETED',
    //           state: 'ACCEPT',
    //           remarks: null,
    //         },
    //         arrivalTime: 1648560600000,
    //         departureTime: 1647196200000,
    //         expectedArrivalTime: 1648506300000,
    //         expectedDepartureTime: 1647239400000,
    //         roomType: 'BKX',
    //         adultsCount: 1,
    //         kidsCount: 0,
    //         comments: 'UPPER FLOOR, SMOKING ROOM',
    //         roomNumber: 407,
    //         checkInComment: 'HIGH FLOOR - SMOKING OOM',
    //         status: 'DI',
    //         address: 'GURGAON',
    //       },
    //       visitDetails: null,
    //       guestAttributes: {
    //         overAllNps: 0.0,
    //         totalSpend: 0.0,
    //         churnProbalilty: 0.0,
    //         numberOfBookings: 0,
    //       },
    //       vip: false,
    //       bookingType: 'PAST',
    //       type: 'BOOKING',
    //     },
    //   ];
    // else if (this.checkForTransactionFeedbackSubscribed())
    //   return [
    //     {
    //       feedbackSubmissionTime: 1648560600000,
    //       intentToRecommends: 3,
    //       serviceType: 'Leisure',
    //       marketSegment: 'Leisure',
    //       comment: {
    //         question:
    //           "We are thrilled you feel that way. What's the main reason for your score?",
    //         answer:
    //           "orem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    //       },
    //       feedbackId: '107c2711-76f3-4fca-8c50-f0b0e1ba18b0',
    //       feedbackType: null,
    //       surveyType: null,
    //       outletId: 'd74d7c75-e160-4ebd-9c35-185f2c17ff74',
    //       type: 'INSTANT',
    //     },
    //   ];
    // else
    //   this.checkForStayFeedbackSubscribed() &&
    //     this.checkForTransactionFeedbackSubscribed();
    return [
      {
        id: '5c5aa0c8-79ca-43c5-8cb4-6e8a3f735edc',
        arrivalTime: 1648680612000,
        departureTime: 1648853412000,
        number: '30652',
        pmsStatus: 'RESERVED',
        state: 'PRECHECKIN',
        stateCompletedSteps: 5,
        stayDetails: {
          statusMessage: {
            code: 0,
            status: 'COMPLETED',
            state: 'ACCEPT',
            remarks: null,
          },
          arrivalTime: 1648680612000,
          departureTime: 1648853412000,
          expectedArrivalTime: 1648680612000,
          expectedDepartureTime: 1648853412000,
          roomType: 'BKX',
          adultsCount: 1,
          kidsCount: 0,
          comments: '',
          roomNumber: 0,
          checkInComment: '',
          status: '',
        },
        visitDetails: {
          statusMessage: {
            code: 0,
            status: 'PENDING',
            state: 'PENDING',
            remarks: null,
          },
          feedbackSubmissionTime: 1648560600000,
          intentToRecommends: 5,
          serviceType: null,
          marketSegment: 'Leisure',
          comment: {
            question:
              "We are thrilled you feel that way. What's the main reason for your score?",
            answer:
              "orem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
          },
          feedbackId: '23e2dd62-fb99-4ef8-92d6-a2c554a692ef',
          feedbackType: null,
          surveyType: null,
          outletId: null,
        },
        guestAttributes: {
          overAllNps: 0.0,
          totalSpend: 0.0,
          churnProbalilty: 0.0,
          numberOfBookings: 0,
        },
        vip: false,
        bookingType: 'UPCOMING',
        type: 'BOOKING',
      },
      {
        id: 'dc15afc7-ad45-49a6-b857-a38e45235c2b',
        arrivalTime: 1648560600000,
        departureTime: 1647196200000,
        number: '30403',
        pmsStatus: 'RESERVED',
        state: 'PRECHECKIN',
        stateCompletedSteps: 3,
        stayDetails: {
          statusMessage: {
            code: 0,
            status: 'COMPLETED',
            state: 'ACCEPT',
            remarks: null,
          },
          arrivalTime: 1648560600000,
          departureTime: 1647196200000,
          expectedArrivalTime: 1648506300000,
          expectedDepartureTime: 1647239400000,
          roomType: 'BKX',
          adultsCount: 1,
          kidsCount: 0,
          comments: 'UPPER FLOOR, SMOKING ROOM',
          roomNumber: 407,
          checkInComment: 'HIGH FLOOR - SMOKING OOM',
          status: 'DI',
          address: 'GURGAON',
        },
        visitDetails: null,
        guestAttributes: {
          overAllNps: 0.0,
          totalSpend: 0.0,
          churnProbalilty: 0.0,
          numberOfBookings: 0,
        },
        vip: false,
        bookingType: 'PAST',
        type: 'BOOKING',
      },
      {
        feedbackSubmissionTime: 1648560600000,
        intentToRecommends: 3,
        serviceType: 'Leisure',
        marketSegment: 'Leisure',
        comment: {
          question:
            "We are thrilled you feel that way. What's the main reason for your score?",
          answer:
            "orem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        },
        feedbackId: '107c2711-76f3-4fca-8c50-f0b0e1ba18b0',
        feedbackType: null,
        surveyType: null,
        outletId: 'd74d7c75-e160-4ebd-9c35-185f2c17ff74',
        type: 'INSTANT',
      },
    ];
  }

  ngOnChanges() {
    this.addFormsControls();
    this.pushDataToForm();
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
