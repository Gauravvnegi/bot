import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DocumentDetailsService } from 'libs/web-user/shared/src/lib/services/document-details.service';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';
import { StepperService } from 'libs/web-user/shared/src/lib/services/stepper.service';
import { ButtonService } from 'libs/web-user/shared/src/lib/services/button.service';
import { BaseWrapperComponent } from '../../base/base-wrapper.component';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';
import { DocumentsDetailsComponent } from '../documents-details/documents-details.component';
import { get } from 'lodash';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'hospitality-bot-documents-details-wrapper',
  templateUrl: './documents-details-wrapper.component.html',
  styleUrls: ['./documents-details-wrapper.component.scss'],
})
export class DocumentsDetailsWrapperComponent extends BaseWrapperComponent
  implements OnInit {
  @Input() parentForm;
  @Input() reservationData;
  @Input() stepperIndex;
  @Input() buttonConfig;

  @ViewChild('documentDetailsComp')
  documentDetailsComp: DocumentsDetailsComponent;

  constructor(
    private _documentDetailService: DocumentDetailsService,
    private _reservationService: ReservationService,
    private _snackBarService: SnackBarService,
    private _stepperService: StepperService,
    private _buttonService: ButtonService,
    private _hotelService: HotelService,
    private _translateService: TranslateService
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

  addFGEvent(data) {
    this.parentForm.addControl(data.name, data.value);
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
            this._translateService
              .get(`MESSAGES.ERROR.${error.type}`)
              .subscribe((translated_msg) => {
                this._snackBarService.openSnackBarAsText(translated_msg);
              });
            // this._snackBarService.openSnackBarAsText(error.message);
            this._buttonService.buttonLoading$.next(
              this.buttonRefs['nextButton']
            );
          }
        )
    );
  }

  private performActionIfNotValid(status: any[]) {
    if (status[0].code) {
      this.$subscription.add(
        this._translateService
          .get(`VALIDATION.${status[0].code}`)
          .subscribe((translated_msg) => {
            this._snackBarService.openSnackBarAsText(translated_msg);
          })
      );
    } else {
      this._snackBarService.openSnackBarAsText(status[0].msg);
    }
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
