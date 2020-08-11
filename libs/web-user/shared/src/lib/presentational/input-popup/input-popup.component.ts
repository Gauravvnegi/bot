import { Component, OnInit, Optional, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReservationService } from '../../services/booking.service';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';
import { ButtonService } from '../../services/button.service';

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

  constructor(
    public dialogRef: MatDialogRef<InputPopupComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder,
    private _reservationService: ReservationService,
    private _snackbar: SnackBarService,
    private _buttonService: ButtonService
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
          this._snackbar.openSnackBarAsText('Checkin successfull', '', {
            panelClass: 'success',
          });
          this.close();
        },
        ({ error }) => {
          this._snackbar.openSnackBarAsText(error.cause);
          this._buttonService.buttonLoading$.next(this.saveButton);
        }
      );
  }

  close() {
    this.dialogRef.close({ event: 'close' });
  }
}
