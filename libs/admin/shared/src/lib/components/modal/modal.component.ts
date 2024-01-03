import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalAction, ModalContent } from '../../types/fields.type';
import { FormBuilder, FormGroup } from '@angular/forms';

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

  constructor(private fb: FormBuilder) {}
  modelForm: FormGroup;

  ngOnInit(): void {
    this.modelForm = this.fb.group({
      remarks: [''],
    });
  }

  defaultAction: ModalAction = {
    label: 'Okay',
    onClick: () => {
      this.close();
    },
    variant: 'contained',
  };

  @Input() actions: ModalAction[];

  @Input() set content(value: ModalContent) {
    for (const key in value) {
      const val = value[key];
      this[key] = val;
    }
    if (value.isReservation) {
      // Add controls conditionally when isReservation is true
      this.modelForm.addControl('chargeable', this.fb.control(''));
      this.modelForm.addControl('chargedAmount', this.fb.control(''));
    }
  }

  @Output() onClose = new EventEmitter();

  close() {
    this.onClose.emit();
  }
}
