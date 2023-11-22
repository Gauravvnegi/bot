import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Option } from '@hospitality-bot/admin/shared';

/**
 * @todo Make this component as additional charge component
 */
@Component({
  selector: 'hospitality-bot-add-refund',
  templateUrl: './add-refund.component.html',
  styleUrls: ['./add-refund.component.scss'],
})
export class AddRefundComponent implements OnInit {
  @Input() heading = 'Additional Charges Amount';
  @Input() maxAmount: number;
  userForm: FormGroup;

  @Output() onClose = new EventEmitter();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.userForm = this.fb.group({
      refundAmount: [
        null,
        [
          Validators.required,
          Validators.max(this.maxAmount + 1),
          Validators.min(0),
        ],
      ],
      remarks: [''],
    });
  }

  handleApply() {
    this.onClose.next({
      refundAmount: +this.userForm.get('refundAmount').value,
      remarks: this.userForm.get('remarks').value,
    });
  }

  handleCancel() {
    this.onClose.emit();
  }

  close() {
    this.onClose.emit();
  }
}
