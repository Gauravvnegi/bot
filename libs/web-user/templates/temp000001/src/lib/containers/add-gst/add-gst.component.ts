import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GSTService } from 'libs/web-user/shared/src/lib/services/gst.service';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { SnackBarService } from 'libs/shared/material/src';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ButtonService } from 'libs/web-user/shared/src/lib/services/button.service';
import { GstConfigI } from 'libs/web-user/shared/src/lib/data-models/gstConfig.model';

@Component({
  selector: 'hospitality-bot-add-gst',
  templateUrl: './add-gst.component.html',
  styleUrls: ['./add-gst.component.scss'],
})
export class AddGstComponent implements OnInit {
  gstFG: FormGroup;
  @Output()
  isSubmittedEvent = new EventEmitter<Object>();
  @ViewChild('saveButton') saveButton;
  gstFieldConfig: GstConfigI;
  $subscription = new Subscription();
  constructor(
    protected fb: FormBuilder,
    protected gstService: GSTService,
    protected reservationService: ReservationService,
    protected translateService: TranslateService,
    protected snackbarService: SnackBarService,
    protected _buttonService: ButtonService,
    public dialogRef: MatDialogRef<AddGstComponent>
  ) {}

  ngOnInit(): void {
    this.gstFieldConfig = this.gstService.setFieldConfigForStayDetails();
    this.initFG();
  }

  protected initFG(): void {
    this.gstFG = this.fb.group({
      customerName: [
        '',
        Validators.compose([
          Validators.required,
          // Validators.pattern('/^[a-zA-Z ]{2,30}$/')
        ]),
      ],
      customerGSTIn: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(
            '^([0][1-9]|[1-2][0-9]|[3][0-7])([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$'
          ),
        ]),
      ],
      address: [''],
    });
  }

  submitGSTDetails(): void {
    if (this.gstFG.invalid) {
      this.snackbarService.openSnackBarAsText('Invalid Form');
      this._buttonService.buttonLoading$.next(this.saveButton);
      return;
    }

    this.$subscription.add(
      this.gstService
        .addGSTDetail(
          this.reservationService.reservationId,
          this.gstFG.getRawValue()
        )
        .subscribe(
          (response) => {
            this.translateService
              .get('MESSAGES.SUCCESS.GST_ADD_COMPLETE')
              .subscribe((translated_msg) => {
                this.snackbarService.openSnackBarAsText(translated_msg, '', {
                  panelClass: 'success',
                });
              });
            this._buttonService.buttonLoading$.next(this.saveButton);
            this.closeModal();
          },
          ({ error }) => {
            this.snackbarService.openSnackBarAsText(error.message);
            this._buttonService.buttonLoading$.next(this.saveButton);
          }
        )
    );
  }

  closeModal() {
    this.dialogRef.close();
  }
}
