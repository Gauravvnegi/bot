import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { RaiseRequestConfigI } from 'libs/web-user/shared/src/lib/data-models/raiseRequestConfig.model';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';
import { RaiseRequestService } from 'libs/web-user/shared/src/lib/services/raise-request.service';
import { customPatternValid } from 'libs/web-user/shared/src/lib/services/validator.service';
import { Subscription } from 'rxjs';
import { Regex } from '../../../../../../shared/src/lib/data-models/regexConstant';
import { SnackBarService } from 'libs/shared/material/src';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'hospitality-bot-raise-request',
  templateUrl: './raise-request.component.html',
  styleUrls: ['./raise-request.component.scss'],
})
export class RaiseRequestComponent implements OnInit, OnDestroy {

  $subscription: Subscription = new Subscription();
  raiseRequestConfig: RaiseRequestConfigI;
  raiseRequestForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _raiseRequestService: RaiseRequestService,
    private _hotelService: HotelService,
    public dialogRef: MatDialogRef<RaiseRequestComponent>,
    private _snackBarService: SnackBarService,
    private _translateService: TranslateService
  ) {
    this.initRaiseRequestForm();
  }

  ngOnInit(): void {
    this.setFieldConfiguration();
  }

  setFieldConfiguration() {
    this.raiseRequestConfig = this._raiseRequestService.setFieldConfigForRaiseRequest();
  }

  initRaiseRequestForm() {
    this.raiseRequestForm = this._fb.group({
      message: ['', [Validators.required]],
      emailId: [
        '',
        [
          Validators.required,
          customPatternValid({
            pattern: Regex.EMAIL_REGEX,
            msg: 'Please enter a valid email',
          }),
        ],
      ],
    });
  }

  close() {
    this.dialogRef.close();
  }

  onSubmit() {
    const data = this.raiseRequestForm.getRawValue();
    this.$subscription.add(
      this._raiseRequestService
      .saveRaiseRequest(this._hotelService.entityId, data)
      .subscribe((response) => {
        this._translateService
          .get(`MESSAGES.SUCCESS.REQUEST_RAISE_COMPLETE`)
          .subscribe((translatedMsg) => {
            this._snackBarService.openSnackBarAsText(
              translatedMsg,
              '',
              { panelClass: 'success' }
            );
          });
        this.close();
      },({error})=>{
        this._translateService
          .get(`MESSAGES.ERROR.${error.type}`)
          .subscribe((translatedMsg) => {
            this._snackBarService.openSnackBarAsText(translatedMsg);
          });
      })
    );
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
