import { Component } from '@angular/core';
import { StayDetailsWrapperComponent as BaseStayDetailsWrapperComponent } from 'libs/web-user/templates/temp000001/src/lib/containers/stay-details-wrapper/stay-details-wrapper.component';
import { AmenitiesService } from 'libs/web-user/shared/src/lib/services/amenities.service';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { ButtonService } from 'libs/web-user/shared/src/lib/services/button.service';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';
import { StayDetailsService } from 'libs/web-user/shared/src/lib/services/stay-details.service';
import { StepperService } from 'libs/web-user/shared/src/lib/services/stepper.service';
import { SnackBarService } from 'libs/shared/material/src';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'hospitality-bot-stay-details-wrapper',
  templateUrl:
    '../../../../../temp000001/src/lib/containers/stay-details-wrapper/stay-details-wrapper.component.html',
  styleUrls: ['./stay-details-wrapper.component.scss'],
})
export class StayDetailsWrapperComponent extends BaseStayDetailsWrapperComponent {
  constructor(
    stayDetailService: StayDetailsService,
    amenitiesService: AmenitiesService,
    hotelService: HotelService,
    reservationService: ReservationService,
    snackBarService: SnackBarService,
    translateService: TranslateService,
    stepperService: StepperService,
    buttonService: ButtonService
  ) {
    super(
      stayDetailService,
      amenitiesService,
      hotelService,
      reservationService,
      snackBarService,
      translateService,
      stepperService,
      buttonService
    );
    this.self = this;
  }
}
