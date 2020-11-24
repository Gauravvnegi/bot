import { Component, OnDestroy, OnInit } from '@angular/core';
import { RaiseRequestService } from 'libs/web-user/shared/src/lib/services/raise-request.service';
import { RaiseRequestConfigI } from 'libs/web-user/shared/src/lib/data-models/raiseRequestConfig.model';
import { Regex } from '../../../../../../shared/src/lib/data-models/regexConstant';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { customPatternValid } from 'libs/web-user/shared/src/lib/services/validator.service';
import { MatDialogRef } from '@angular/material/dialog';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';
import { Subscription } from 'rxjs';
import { SnackBarService } from 'libs/shared/material/src';

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
    private _snackbarService: SnackBarService,
    public dialogRef: MatDialogRef<RaiseRequestComponent>
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
      .saveRaiseRequest(this._hotelService.hotelId, data)
      .subscribe((response) => {
        this._snackbarService.openSnackBarAsText('Request was raised successfully','',
        { panelClass: 'success' }
      );
        this.close();
      },({error})=>{
        this._snackbarService.openSnackBarAsText(error.message);
      })
    );
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
