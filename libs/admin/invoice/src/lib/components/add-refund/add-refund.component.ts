import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

/**
 * @todo Make this component as additional charge component
 */
@Component({
  selector: 'hospitality-bot-add-refund',
  templateUrl: './add-refund.component.html',
  styleUrls: ['./add-refund.component.scss'],
})
export class AddRefundComponent implements OnInit {
  heading = 'Additional Charges Amount';
  isReservationPopup = false;
  userForm: FormGroup;
  chargedAmount: number = 0;

  constructor(
    private fb: FormBuilder,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig
  ) {
    const data: {
      heading: string;
      isReservationPopup?: boolean;
      chargedAmount?: number;
    } = dialogConfig?.data;
    this.heading = data?.heading;
    this.isReservationPopup = data?.isReservationPopup;
    this.chargedAmount = data?.chargedAmount;
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.userForm = !this.isReservationPopup
      ? this.fb.group({
          refundAmount: [null, [Validators.required, Validators.min(0)]],
          remarks: [''],
        })
      : this.fb.group({
          chargedAmount: [this.chargedAmount],
          remarks: [''],
        });
  }

  handleApply() {
    !this.isReservationPopup
      ? this.dialogRef.close({
          refundAmount: +this.userForm.get('refundAmount').value,
          remarks: this.userForm.get('remarks').value,
        })
      : this.dialogRef.close({
          chargedAmount: +this.userForm.get('chargedAmount').value,
          remarks: this.userForm.get('remarks').value,
        });
  }

  close() {
    this.dialogRef.close();
  }
}
