import { Component, OnInit, ViewChild } from '@angular/core';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { ButtonService } from 'libs/web-user/shared/src/lib/services/button.service';
import { DocumentDetailsService } from 'libs/web-user/shared/src/lib/services/document-details.service';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';
import { StepperService } from 'libs/web-user/shared/src/lib/services/stepper.service';
import { UtilityService } from 'libs/web-user/shared/src/lib/services/utility.service';
import { get } from 'lodash';
import { BaseWrapperComponent } from '../../base/base-wrapper.component';
import { DocumentsDetailsComponent } from '../documents-details/documents-details.component';
@Component({
  selector: 'hospitality-bot-documents-details-wrapper',
  templateUrl: './documents-details-wrapper.component.html',
  styleUrls: ['./documents-details-wrapper.component.scss'],
})
export class DocumentsDetailsWrapperComponent extends BaseWrapperComponent
  implements OnInit {
  @ViewChild('documentDetailsComp')
  documentDetailsComp: DocumentsDetailsComponent;

  constructor(
    private _documentDetailService: DocumentDetailsService,
    private _reservationService: ReservationService,
    private _stepperService: StepperService,
    private _buttonService: ButtonService,
    private _hotelService: HotelService,
    private utilService: UtilityService
  ) {
    super();
    this.self = this;
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.initDocumentDetailsDS();
  }

  private initDocumentDetailsDS() {
    this._documentDetailService.initDocumentDetailDS(this.reservationData);
  }

  /**
   * Function to save/update the documents for all the guests on next click
   */

  private saveDocumentDetails() {
    const status = this._documentDetailService.validateDocumentationForm(
      this.parentForm,
      this._hotelService.currentJourney
    ) as Array<any>;

    if (status.length) {
      this.performActionIfNotValid(status);
      this._buttonService.buttonLoading$.next(this.buttonRefs['nextButton']);
      return;
    }

    const formValue = this.parentForm.getRawValue();
    const data = this._documentDetailService.modifyDocumentDetails(
      formValue,
      this._hotelService.currentJourney
    );

    this.$subscription.add(
      this._documentDetailService
        .updateGuestDetails(this._reservationService.reservationId, data)
        .subscribe(
          (response) => {
            this._buttonService.buttonLoading$.next(
              this.buttonRefs['nextButton']
            );
            this._stepperService.setIndex('next');
          },
          ({ error }) => {
            this.utilService.showErrorMessage(error);
            // this._snackBarService.openSnackBarAsText(error.message);
            this._buttonService.buttonLoading$.next(
              this.buttonRefs['nextButton']
            );
          }
        )
    );
  }

  private performActionIfNotValid(status: any[]) {
    this.utilService.showErrorMessage(`VALIDATION.${status[0].code}`, { documentType: status[0].type });
    if (get(status[0], ['data', 'index']) >= 0) {
      this.documentDetailsComp.accordion.closeAll();
      const allPanels = this.documentDetailsComp.panelList.toArray();
      allPanels[status[0].data.index].open();
    } else {
      this.documentDetailsComp.accordion.openAll();
    }
    return;
  }

  goBack() {
    this._stepperService.setIndex('back');
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
