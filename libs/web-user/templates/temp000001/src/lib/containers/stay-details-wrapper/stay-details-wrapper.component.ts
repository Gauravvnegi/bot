import { Component } from '@angular/core';
import { AmenitiesService } from 'libs/web-user/shared/src/lib/services/amenities.service';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { ButtonService } from 'libs/web-user/shared/src/lib/services/button.service';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';
import { StayDetailsService } from 'libs/web-user/shared/src/lib/services/stay-details.service';
import { StepperService } from 'libs/web-user/shared/src/lib/services/stepper.service';
import { UtilityService } from 'libs/web-user/shared/src/lib/services/utility.service';
import { BaseWrapperComponent } from '../../base/base-wrapper.component';

export interface IStayDetailsWrapper {
  saveStayDetails(): void;
}

@Component({
  selector: 'hospitality-bot-stay-details-wrapper',
  templateUrl: './stay-details-wrapper.component.html',
  styleUrls: ['./stay-details-wrapper.component.scss'],
})
export class StayDetailsWrapperComponent extends BaseWrapperComponent
  implements IStayDetailsWrapper {
  isAmenityDataAvl: boolean = false;

  constructor(
    private _stayDetailService: StayDetailsService,
    private _amenitiesService: AmenitiesService,
    private _hotelService: HotelService,
    private _reservationService: ReservationService,
    private utilService: UtilityService,
    private _stepperService: StepperService,
    private _buttonService: ButtonService,
  ) {
    super();
    this.self = this;
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.fetchData();
    this.initStayDetailsDS();
  }

  fetchData(): void {
    this.getHotelAmenities();
  }

  initStayDetailsDS(): void {
    this._stayDetailService.initStayDetailDS(this.reservationData);
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

  /**
   * Function to save/update all the details for guest stay on Next button click
   */
  saveStayDetails(): void {
    const formValue = this.parentForm.getRawValue();
    const data = this._stayDetailService.modifyStayDetails(formValue);

    this.$subscription.add(
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
          ({ error }) => {
            this._buttonService.buttonLoading$.next(
              this.buttonRefs['nextButton']
            );
            this.utilService.showErrorMessage(error);
          }
        )
    );
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
