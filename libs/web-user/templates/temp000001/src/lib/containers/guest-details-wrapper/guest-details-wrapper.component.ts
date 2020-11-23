import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { GuestDetailsService } from 'libs/web-user/shared/src/lib/services/guest-details.service';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';
import { StepperService } from 'libs/web-user/shared/src/lib/services/stepper.service';
import { ButtonService } from 'libs/web-user/shared/src/lib/services/button.service';
import { BaseWrapperComponent } from '../../base/base-wrapper.component';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';
import { get } from 'lodash';
import { GuestDetailsComponent } from '../guest-details/guest-details.component';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'hospitality-bot-guest-details-wrapper',
  templateUrl: './guest-details-wrapper.component.html',
  styleUrls: ['./guest-details-wrapper.component.scss'],
})
export class GuestDetailsWrapperComponent extends BaseWrapperComponent
  implements OnInit {
  @Input() parentForm;
  @Input() reservationData;
  @Input() stepperIndex;
  @Input() buttonConfig;

  @ViewChild('guestDetailsComp')
  guestDetailsComp: GuestDetailsComponent;

  constructor(
    private _guestDetailService: GuestDetailsService,
    private _reservationService: ReservationService,
    private _snackBarService: SnackBarService,
    private _hotelService: HotelService,
    private _stepperService: StepperService,
    private _buttonService: ButtonService,
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

  addFGEvent(data) {
    this.parentForm.addControl(data.name, data.value);
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
              .subscribe((translated_msg) => {
                this._snackBarService.openSnackBarAsText(translated_msg);
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

    this.$subscription.add(
      this._translateService
        .get(`MESSAGES.VALIDATION.${status[0].code}`)
        .subscribe((translated_msg) => {
          this._snackBarService.openSnackBarAsText(translated_msg);
        })
    );

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
