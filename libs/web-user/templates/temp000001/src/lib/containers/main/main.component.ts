import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';
import { DateService } from 'libs/shared/utils/src/lib/date.service';
import { ReservationDetails } from 'libs/web-user/shared/src/lib/data-models/reservationDetails';
import { CheckinDateAlertComponent } from 'libs/web-user/shared/src/lib/presentational/checkin-date-alert/checkin-date-alert.component';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';
import { ParentFormService } from 'libs/web-user/shared/src/lib/services/parentForm.service';
import { StepperService } from 'libs/web-user/shared/src/lib/services/stepper.service';
import { TemplateLoaderService } from 'libs/web-user/shared/src/lib/services/template-loader.service';
import { TemplateService } from 'libs/web-user/shared/src/lib/services/template.service';
import { ITemplateTemp000001 } from 'libs/web-user/shared/src/lib/types/temp000001';
import { Subscription } from 'rxjs';
import { Temp000001StepperComponent } from '../../presentational/temp000001-stepper/temp000001-stepper.component';

@Component({
  selector: 'hospitality-bot-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  protected $subscription: Subscription = new Subscription();
  @ViewChild('stepperComponent') stepperComponent: Temp000001StepperComponent;
  protected checkInDialogRef: MatDialogRef<CheckinDateAlertComponent>;
  protected checkInDateAlert = CheckinDateAlertComponent;
  modalVisible = false;
  showFooterSocialIcons = true;
  stepperData: ITemplateTemp000001;
  parentForm: FormArray = new FormArray([]);
  reservationData: ReservationDetails;
  isReservationData: boolean = false;

  constructor(
    protected fb: FormBuilder,
    private router: Router,
    private _reservationService: ReservationService,
    private _templateLoadingService: TemplateLoaderService,
    private _parentFormService: ParentFormService,
    protected _hotelService: HotelService,
    protected _templateService: TemplateService,
    protected _stepperService: StepperService,
    protected _modal: ModalService,
    protected dateService: DateService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.getReservationDetails();
    this.registerListeners();
  }

  getReservationDetails(): void {
    this.$subscription.add(
      this._reservationService
        .getReservationDetails(this._reservationService.reservationId)
        .subscribe(
          (reservationData) => {
            this._hotelService.hotelConfig = reservationData['hotel'];
            this.isReservationData = true;
            this.stepperData = this._templateService.templateData[
              this._templateService.templateId
            ];
            this._hotelService.titleConfig$.next(reservationData['hotel']);
            this.getStepperData();
            this.listenForStepperChange();
            this.reservationData = reservationData;
            this._reservationService.reservationData = reservationData;
          },
          ({ error }) => {
            if (error.type == 'BOOKING_CANCELED') {
              this.getHotelDataById();
            }
          }
        )
    );
  }

  listenForStepperChange() {
    this.$subscription.add(
      this._stepperService.stepperSelectedIndex$.subscribe((index) => {
        const templateData = this._templateService.templateData[
          this._templateService.templateId
        ];
        if (templateData) {
          this.showFooterSocialIcons =
            index === templateData.stepConfigs.length - 1;
        }
      })
    );
  }

  // TO-DO: Remove this function
  modifyStepperData(data) {
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

  getHotelDataById() {
    this._hotelService.getHotelConfigById(this._hotelService.hotelId).subscribe(
      (hotel) => {
        this._hotelService.hotelConfig = hotel;
        this.router.navigate(['booking-cancel'], {
          preserveQueryParams: true,
        });
        this._hotelService.titleConfig$.next(hotel);
        this._templateLoadingService.isTemplateLoading$.next(false);
      },
      ({ error }) => {}
    );
  }

  registerListeners() {
    this.$subscription.add(
      this.parentForm.valueChanges.subscribe((val) => {
        this._parentFormService.parentFormValueAndValidity$.next({
          parentForm: this.parentForm,
        });
      })
    );
  }

  getStepperData() {
    this.initStepperParentFG();
    return true;
  }

  initStepperParentFG(): void {
    this.stepperData.stepConfigs.forEach((stepConfig) => {
      const group: FormGroup = this.fb.group({});
      this.parentForm.push(group);
    });
  }
}
