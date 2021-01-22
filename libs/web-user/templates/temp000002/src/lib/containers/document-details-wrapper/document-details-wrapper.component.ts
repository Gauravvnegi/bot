import { Component, OnInit } from '@angular/core';
import { DocumentsDetailsWrapperComponent as BaseDocumentDetailsWrapperComponent } from 'libs/web-user/templates/temp000001/src/lib/containers/documents-details-wrapper/documents-details-wrapper.component';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { ButtonService } from 'libs/web-user/shared/src/lib/services/button.service';
import { DocumentDetailsService } from 'libs/web-user/shared/src/lib/services/document-details.service';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';
import { StepperService } from 'libs/web-user/shared/src/lib/services/stepper.service';
import { SnackBarService } from 'libs/shared/material/src';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'hospitality-bot-document-details-wrapper',
  templateUrl:
    '../../../../../temp000001/src/lib/containers/documents-details-wrapper/documents-details-wrapper.component.html',
  styleUrls: ['./document-details-wrapper.component.scss'],
})
export class DocumentDetailsWrapperComponent extends BaseDocumentDetailsWrapperComponent {
  constructor(
    documentDetailService: DocumentDetailsService,
    reservationService: ReservationService,
    stepperService: StepperService,
    buttonService: ButtonService,
    hotelService: HotelService,
    snackBarService: SnackBarService,
    translateService: TranslateService
  ) {
    super(
      documentDetailService,
      reservationService,
      stepperService,
      buttonService,
      hotelService,
      snackBarService,
      translateService
    );
    this.self = this;
  }
}
