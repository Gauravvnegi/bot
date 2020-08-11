import { Component, OnInit, Input } from '@angular/core';
import { StayDetailsService } from 'libs/web-user/shared/src/lib/services/stay-details.service';
import { SnackBarService } from 'libs/shared/material/src';
import { StepperService } from 'libs/web-user/shared/src/lib/services/stepper.service';
import { ButtonService } from 'libs/web-user/shared/src/lib/services/button.service';
import { BaseWrapperComponent } from '../../base/base-wrapper.component';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';

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

  constructor(
    private _stayDetailService: StayDetailsService,
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
  }

  initStayDetailsDS() {
    this._stayDetailService.initStayDetailDS(this.reservationData);
  }

  addFGEvent(data) {
    this.parentForm.addControl(data.name, data.value);
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
