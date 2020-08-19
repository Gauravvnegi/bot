import { Component, Input, OnInit } from '@angular/core';
import { SnackBarService } from 'libs/shared/material/src';
import { AmenitiesService } from 'libs/web-user/shared/src/lib/services/amenities.service';
import { ComplimentaryService } from 'libs/web-user/shared/src/lib/services/complimentary.service';
import { PaidService } from 'libs/web-user/shared/src/lib/services/paid.service';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { ButtonService } from 'libs/web-user/shared/src/lib/services/button.service';
import { StayDetailsService } from 'libs/web-user/shared/src/lib/services/stay-details.service';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';
import { StepperService } from 'libs/web-user/shared/src/lib/services/stepper.service';
import { BaseWrapperComponent } from '../../base/base-wrapper.component';

@Component({
  selector: 'hospitality-bot-stay-details-wrapper',
  templateUrl: './stay-details-wrapper.component.html',
  styleUrls: ['./stay-details-wrapper.component.scss'],
})
export class StayDetailsWrapperComponent extends BaseWrapperComponent
  implements OnInit {

  @Input() parentForm;
  @Input() reservationData;
  @Input() stepperIndex;
  @Input() buttonConfig;

  amenities;

  constructor(
    private _stayDetailService: StayDetailsService,
    private _amenitiesService: AmenitiesService,
    private _complimentaryService: ComplimentaryService,
    private _paidService: PaidService,
    private _hotelService: HotelService,
    private _reservationService: ReservationService,
    private _snackBarService: SnackBarService,
    private _stepperService: StepperService,
    private _buttonService: ButtonService
  ) {
    super();
    this.self = this;
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.initStayDetailsDS();
    this.getHotelAmenities();
  }

  initStayDetailsDS() {
    this._stayDetailService.initStayDetailDS(this.reservationData);
  }

  addFGEvent(data) {
    this.parentForm.addControl(data.name, data.value);
  }

  addAmenitiesFGEvent(data) {
    this.parentForm.addControl(data.name, data.value);
  }

  getHotelAmenities(){
    //use this._hotelService.hotelId
    this._amenitiesService.getHotelAmenities('caf7ada8-e4bb-427e-8fb8-01e9c3ff3713')
    .subscribe(response =>{
      this.amenities = response;
      this._complimentaryService.initComplimentaryAmenitiesDetailDS(this.amenities && this.amenities.complimentryAmenities);
      this._paidService.initPaidAmenitiesDetailDS(this.amenities && this.amenities.paidAmenities);
    })
  }

  saveStayDetails() {
    const formValue = this.parentForm.getRawValue();
    const data = this._stayDetailService.modifyStayDetails(formValue);

    this._stayDetailService
      .updateStayDetails(this._reservationService.reservationId, data)
      .subscribe(
        (response) => {
          this._stayDetailService.updateStayDetailDS(response.stayDetails);
          this._buttonService.buttonLoading$.next(
            this.buttonRefs['nextButton']
          );
          this._stepperService.setIndex('next');
        },
        (error) => {
          this._snackBarService.openSnackBarAsText('Some error occured');
          this._buttonService.buttonLoading$.next(
            this.buttonRefs['nextButton']
          );
        }
      );
  }
}
