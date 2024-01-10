import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalAction } from 'libs/admin/shared/src/lib/types/fields.type';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'hospitality-bot-journey-dialog',
  templateUrl: './journey-dialog.component.html',
  styleUrls: ['./journey-dialog.component.scss'],
})
export class JourneyDialogComponent implements OnInit {
  useForm!: FormGroup;
  title: string = '';
  descriptions: string[] = ['Are you sure?'];
  isSendInvoice: boolean = false;

  @Output() onClose = new EventEmitter<{ isInvoice?: boolean }>();

  constructor(
    public fb: FormBuilder,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig
  ) {
    this.useForm = this.fb.group({
      invoiceStatus: [false],
    });
    const data = dialogConfig?.data as ConfirmDialogData;
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        this[key] = value;
      });
    }
  }

  ngOnInit(): void {}

  onAcceptClick() {
    this.dialogRef.close({
      isInvoice: this.useForm.get('invoiceStatus').value,
    });
  }

  handleClose() {
    this.dialogRef.close();
  }
}

export type ConfirmDialogData = {
  title?: string;
  descriptions?: string[];
  isSendInvoice?: boolean;
};
