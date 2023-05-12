import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AmenitiesService } from 'libs/web-user/shared/src/lib/services/amenities.service';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { ButtonService } from 'libs/web-user/shared/src/lib/services/button.service';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';
import { StayDetailsService } from 'libs/web-user/shared/src/lib/services/stay-details.service';
import { StepperService } from 'libs/web-user/shared/src/lib/services/stepper.service';
import { BaseWrapperComponent } from '../../base/base-wrapper.component';
import { SnackBarService } from 'libs/shared/material/src';
import { TranslateService } from '@ngx-translate/core';
import { AddressComponent } from '../address/address.component';
import { DocumentDetailsService } from 'libs/web-user/shared/src/lib/services/document-details.service';
import { FormBuilder, Validators } from '@angular/forms';

export interface IStayDetailsWrapper {
  saveStayDetails(): void;
}

@Component({
  selector: 'hospitality-bot-stay-details-wrapper',
  templateUrl: './stay-details-wrapper.component.html',
  styleUrls: ['./stay-details-wrapper.component.scss'],
})
export class StayDetailsWrapperComponent extends BaseWrapperComponent
  implements IStayDetailsWrapper, OnInit, OnDestroy {
  @ViewChild('addressFields') addressFields: AddressComponent;
  isAmenityDataAvl = false;
  countries = [];
  constructor(
    private _stayDetailService: StayDetailsService,
    private _amenitiesService: AmenitiesService,
    private _hotelService: HotelService,
    private _reservationService: ReservationService,
    private _snackBarService: SnackBarService,
    private _translateService: TranslateService,
    private _stepperService: StepperService,
    private _buttonService: ButtonService,
    private _documentDetailService: DocumentDetailsService,
    protected fb: FormBuilder
  ) {
    super();
    this.self = this;
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.fetchData();
    this.initStayDetailsDS();
    this.getCountriesList();
  }

  addDeclaimerCheckbox() {
    const isFirstStepCompleted = this.reservationData.stateCompletedSteps > 0;
    const form = this.fb.group({
      disclaimer: [isFirstStepCompleted, Validators.requiredTrue],
    });
    this.addFGEvent({
      name: 'accept',
      value: form,
    });
  }

  fetchData(): void {
    this.getHotelAmenities();
  }

  initStayDetailsDS(): void {
    this._stayDetailService.initStayDetailDS(
      this.reservationData,
      this._hotelService.hotelConfig.timezone
    );

    this.addDeclaimerCheckbox();
  }

  getHotelAmenities(): void {
    this.$subscription.add(
      this._amenitiesService
        .getHotelAmenities(this._hotelService.hotelId)
        .subscribe((response) => {
          this.isAmenityDataAvl = true;
          this._amenitiesService.initAmenitiesDetailDS(
            response,
            this._stayDetailService.stayDetails.stayDetail.arrivalTime
          );
        })
    );
  }

  getCountriesList() {
    this.$subscription.add(
      this._documentDetailService.getCountryList().subscribe(
        (countriesList) => {
          this.countries = countriesList.map((country) => {
            //@todo change key
            return {
              key: country.nationality,
              value: country.name,
              id: country.id,
              nationality: country.nationality,
            };
          });
        },
        ({ error }) => {
          this._translateService.get(error.code).subscribe((translatedMsg) => {
            this._snackBarService.openSnackBarAsText(translatedMsg);
          });
        }
      )
    );
  }

  /**
   * Function to save/update all the details for guest stay on Next button click
   */
  saveStayDetails(): void {
    const {
      accept,
      address,
      amenities,
      special_comments,
      stayDetail,
    } = this.parentForm.controls;
    if (
      accept.invalid ||
      address.invalid ||
      special_comments.invalid ||
      stayDetail.invalid
    ) {
      this.parentForm.markAllAsTouched();
      if (
        this._hotelService.hotelConfig?.showAddress &&
        this.parentForm.get('address').invalid
      )
        this.openPanels(this.addressFields.panelList.toArray());

      if (!this.parentForm.get('accept').get('disclaimer').value) {
        this._snackBarService.openSnackBarAsText('Please accept disclaimer');
      }
      this._buttonService.buttonLoading$.next(this.buttonRefs['nextButton']);
      return;
    }

    const formValue = this.parentForm.getRawValue();
    const data = this._stayDetailService.modifyStayDetails(
      formValue,
      this._hotelService.hotelConfig.timezone,
      this.countries,
      this._hotelService.hotelConfig?.showAddress
    );
    this.$subscription.add(
      this._stayDetailService
        .updateStayDetails(this._reservationService.reservationId, data)
        .subscribe(
          (response) => {
            this._stayDetailService.updateStayDetailDS(
              response.stayDetails,
              this._hotelService.hotelConfig.timezone
            );
            this._buttonService.buttonLoading$.next(
              this.buttonRefs['nextButton']
            );
            this._stepperService.setIndex('next');
          },
          ({ error }) => {
            this._buttonService.buttonLoading$.next(
              this.buttonRefs['nextButton']
            );
            this._translateService
              .get(`MESSAGES.ERROR.${error.type}`)
              .subscribe((translatedMsg) => {
                this._snackBarService.openSnackBarAsText(translatedMsg);
              });
          }
        )
    );
  }

  openPanels(panelList) {
    panelList.forEach((s, index) => {
      panelList[index].open();
    });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
