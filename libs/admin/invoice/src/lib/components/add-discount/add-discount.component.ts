import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Option } from '@hospitality-bot/admin/shared';
import { errorMessages } from 'libs/admin/room/src/lib/constant/form';

@Component({
  selector: 'hospitality-bot-add-discount',
  templateUrl: './add-discount.component.html',
  styleUrls: ['./add-discount.component.scss'],
})
export class AddDiscountComponent implements OnInit {
  readonly errorMessages = errorMessages;

  @Input() tax: number;
  @Input() serviceName: string;
  @Input() originalAmount: number;
  totalDiscount: number = 0;
  discountForm: FormGroup;
  discountOptions: Option[] = [
    { label: 'Flat', value: 'NUMBER' },
    { label: '%Off', value: 'PERCENTAGE' },
  ];

  @Output() onClose = new EventEmitter();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.discountForm = this.fb.group({
      discountType: ['PERCENTAGE'],
      discountValue: [0, [Validators.min(0)]],
    });

    this.registerRateAndDiscountChange();
  }

  registerRateAndDiscountChange() {
    const discountType = this.discountForm.get('discountType');
    const discountValue = this.discountForm.get('discountValue');

    const setDiscountValueAndErrors = () => {
      const discount = +(discountValue.value ?? 0);
      const type = discountType.value;

      const totalAmount =
        this.originalAmount + (this.tax / 100) * this.originalAmount;
      if (this.originalAmount)
        if (type === 'NUMBER') {
          const totalPercent = (100 / this.originalAmount) * discount;
          this.totalDiscount = +((totalPercent / 100) * totalAmount).toFixed(2);
        } else {
          this.totalDiscount = +((discount / 100) * totalAmount).toFixed(2);
        }

      if (type === 'NUMBER' && discount > this.originalAmount) {
        return 'isNumError';
      }

      if (type === 'PERCENTAGE' && discount > 100) {
        return 'isPercentError';
      }

      if (discount < 0) {
        return 'isMinError';
      }
    };

    const clearError = () => {
      discountValue.setErrors(null);
    };

    /**
     * @function discountSubscription To handle changes in discount value
     */
    const discountSubscription = () => {
      discountValue.enable({ emitEvent: false });
      clearError();
      const error = setDiscountValueAndErrors();
      if (error === 'isNumError') {
        discountValue.setErrors({ isDiscountMore: true });
      }
      if (error === 'isPercentError') {
        discountValue.setErrors({ moreThan100: true });
      }
      if (error === 'isMinError') {
        discountValue.setErrors({ min: true });
      }
    };

    /* Discount Subscription */
    discountValue.valueChanges.subscribe(discountSubscription);
    discountType.valueChanges.subscribe(discountSubscription);
  }

  handleApply() {
    this.onClose.next({
      totalDisount: this.totalDiscount
    })
  }

  handleCancel() {
    this.onClose.emit();
  }

  close() {
    this.onClose.emit();
  }
}
