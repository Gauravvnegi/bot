import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalAction, ModalContent } from '../../types/fields.type';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'hospitality-bot-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  heading: string = 'Notification';
  descriptions: string[] = ['Are you sure?'];
  subText: string;
  isRemarks: boolean = false;
  isReservation: boolean = false;

  constructor(
    private fb: FormBuilder,
    public dialogConfig: DynamicDialogConfig, //generic not supported yet,
    public dialogRef: DynamicDialogRef
  ) {
    const data = dialogConfig?.data as ModalContent;
    if (data) {
      this.mapInputData(data);
    }
  }

  modelForm: FormGroup;

  ngOnInit(): void {
    this.modelForm = this.fb.group({
      remarks: ['', [Validators.required]],
    });

    if (this.isReservation) {
      // Add controls conditionally when isReservation is true
      this.modelForm.addControl('chargeable', this.fb.control(false));
      this.modelForm.addControl('chargedAmount', this.fb.control(0));
      this.modelForm.get('chargeable').valueChanges.subscribe((res) => {
        if (res === false) this.modelForm.get('chargedAmount').patchValue(0);
      });
    }
  }

  defaultAction: ModalAction = {
    label: 'Ok',
    onClick: () => {
      this.close();
    },
    variant: 'contained',
  };

  @Input() actions: ModalAction[];

  @Input() set content(value: ModalContent) {
    this.mapInputData(value);
  }

  mapInputData(value: ModalContent) {
    Object.entries(value).forEach(([key, value]) => {
      this[key] = value;
    });
  }

  @Output() onClose = new EventEmitter();

  close() {
    this.dialogRef.close();
    this.onClose.emit();
  }
}
