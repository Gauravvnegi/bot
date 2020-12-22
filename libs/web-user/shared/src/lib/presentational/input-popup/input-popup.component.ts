import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ReservationService } from '../../services/booking.service';
import { ButtonService } from '../../services/button.service';
import { SnackBarService } from 'libs/shared/material/src';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'web-user-input-popup',
  templateUrl: './input-popup.component.html',
  styleUrls: ['./input-popup.component.scss'],
})
export class InputPopupComponent implements OnInit {
  dialaogData: any;
  requestForm: FormGroup;
  button;
  @ViewChild('saveButton') saveButton;
  private $subscription: Subscription = new Subscription();

  constructor(
    public dialogRef: MatDialogRef<InputPopupComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder,
    private _reservationService: ReservationService,
    private _buttonService: ButtonService,
    private _snackBarService: SnackBarService,
    private _translateService: TranslateService
  ) {
    this.dialaogData = data.pageValue;
  }

  ngOnInit(): void {
    this.button = { label: this.dialaogData.buttonText };
    this.initRequestForm();
  }

  initRequestForm() {
    this.requestForm = this._fb.group({
      request: [''],
    });
  }

  checkIn() {
    const data = {
      special_remarks: this.requestForm.get('request').value,
    };
    this._reservationService
      .checkIn(this._reservationService.reservationData.id, data)
      .subscribe(
        (res) => {
          this._translateService
          .get(`MESSAGES.SUCCESS.CHECKIN_COMPLETE`)
          .subscribe((translatedMsg) => {
            this._snackBarService.openSnackBarAsText(translatedMsg);
          });
          this.close('success');
        },
        ({ error }) => {
          this._translateService
            .get(`MESSAGES.ERROR.${error.type}`)
            .subscribe((translatedMsg) => {
              this._snackBarService.openSnackBarAsText(translatedMsg);
            });
          this._buttonService.buttonLoading$.next(this.saveButton);
          //this.close('success');
        }
      );
  }

  close(state?) {
    let data;
    if (state) {
      data = { event: 'close', state: state };
    } else {
      data = { event: 'close' };
    }
    this.dialogRef.close(data);
  }
}
