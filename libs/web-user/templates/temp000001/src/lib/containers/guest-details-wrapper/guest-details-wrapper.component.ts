import { Component, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { ButtonService } from 'libs/web-user/shared/src/lib/services/button.service';
import { GuestDetailsService } from 'libs/web-user/shared/src/lib/services/guest-details.service';
import { StepperService } from 'libs/web-user/shared/src/lib/services/stepper.service';
import { UtilityService } from 'libs/web-user/shared/src/lib/services/utility.service';
import { get } from 'lodash';
import { BaseWrapperComponent } from '../../base/base-wrapper.component';
import { GuestDetailsComponent } from '../guest-details/guest-details.component';
import { SnackBarService } from 'libs/shared/material/src';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'hospitality-bot-guest-details-wrapper',
  templateUrl: './guest-details-wrapper.component.html',
  styleUrls: ['./guest-details-wrapper.component.scss'],
})
export class GuestDetailsWrapperComponent extends BaseWrapperComponent {
  @ViewChild('guestDetailsComp')
  guestDetailsComp: GuestDetailsComponent;

  constructor(
    private _guestDetailService: GuestDetailsService,
    private _reservationService: ReservationService,
    private _stepperService: StepperService,
    private _buttonService: ButtonService,
    private _snackBarService: SnackBarService,
    private _translateService: TranslateService
  ) {
    super();
    this.self = this;
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.initGuestDetailsDS();
  }

  initGuestDetailsDS() {
    this._guestDetailService.initGuestDetailDS(this.reservationData);
  }

  /**
   * Funtion to save/update all the guests personal details for on Next button click
   */

  saveGuestDetails() {
    const status = this._guestDetailService.validateGuestDetailForm(
      this.parentForm
    ) as Array<any>;

    if (status.length) {
      this.performActionIfNotValid(status);
      this._buttonService.buttonLoading$.next(this.buttonRefs['nextButton']);
      return;
    }

    const formValue = this.parentForm.getRawValue();
    const data = this._guestDetailService.modifyGuestDetails(formValue);

    this.$subscription.add(
      this._guestDetailService
        .updateGuestDetails(this._reservationService.reservationId, data)
        .subscribe(
          (response) => {
            this._guestDetailService.updateGuestDetailDS(response.guestDetails);
            this._buttonService.buttonLoading$.next(
              this.buttonRefs['nextButton']
            );
            this._stepperService.setIndex('next');
          },
          ({ error }) => {
            this._translateService
              .get(`MESSAGES.ERROR.${error.type}`)
              .subscribe((translatedMsg) => {
                this._snackBarService.openSnackBarAsText(translatedMsg);
              });
            //   this._snackBarService.openSnackBarAsText(error.message);
            this._buttonService.buttonLoading$.next(
              this.buttonRefs['nextButton']
            );
          }
        )
    );
  }

  private performActionIfNotValid(status: any[]) {
    const guestDetailFG = this.parentForm.get('guestDetail') as FormGroup;
    guestDetailFG.markAllAsTouched();

    this._translateService
      .get(`VALIDATION.${status[0].code}`)
      .subscribe((translatedMsg) => {
        this._snackBarService.openSnackBarAsText(translatedMsg);
      });

    if (get(status[0], ['data', 'type']) == 'primary') {
      this.guestDetailsComp.primaryGuestAccordian.openAll();
      this.guestDetailsComp.secondaryGuestAccordian &&
        this.guestDetailsComp.secondaryGuestAccordian.closeAll();
    } else {
      this.guestDetailsComp.primaryGuestAccordian.closeAll();
      this.guestDetailsComp.secondaryGuestAccordian &&
        this.guestDetailsComp.secondaryGuestAccordian.closeAll();
      const allPanels = this.guestDetailsComp.secondaryGuestPanelList.toArray();
      allPanels[status[0].data.index].open();
    }
    return;
  }

  goBack() {
    this._stepperService.setIndex('back');
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
