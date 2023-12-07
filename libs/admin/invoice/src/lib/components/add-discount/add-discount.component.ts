import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminUtilityService, Option } from '@hospitality-bot/admin/shared';
import { errorMessages } from 'libs/admin/room/src/lib/constant/form';
import { MenuActionItem } from '../../constants/invoice.constant';

@Component({
  selector: 'hospitality-bot-add-discount',
  templateUrl: './add-discount.component.html',
  styleUrls: ['./add-discount.component.scss'],
})
export class AddDiscountComponent implements OnInit {
  readonly errorMessages = errorMessages;

  isRemove = false;
  isUpdate = false;
  isAdd = false;

  @Input() serviceName: string;
  @Input() originalAmount: number;
  @Input() set discountAction(val: MenuActionItem) {
    this.isAdd = val === MenuActionItem.ADD_DISCOUNT;
    this.isRemove = val === MenuActionItem.REMOVE_DISCOUNT;
    this.isUpdate = val === MenuActionItem.EDIT_DISCOUNT;
  }

  totalDiscount: number;
  discountType: string;

  discountForm: FormGroup;
  discountOptions: Option[] = [
    { label: 'Flat', value: 'FLAT' },
    { label: '%Off', value: 'PERCENTAGE' },
  ];

  @Output() onClose = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private adminUtilityService: AdminUtilityService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.discountForm = this.fb.group({
      discountType: ['PERCENTAGE'],
      discountValue: [null, [Validators.min(0)]],
    });

    this.registerRateAndDiscountChange();
  }

  registerRateAndDiscountChange() {
    const discountType = this.discountForm.get('discountType');
    const discountValue = this.discountForm.get('discountValue');

    const setDiscountValueAndErrors = () => {
      const discount = +(discountValue.value ?? 0);
      const type = discountType.value;

      if (this.originalAmount)
        if (type === 'FLAT') {
          this.totalDiscount = discount;
        } else {
          this.totalDiscount = this.adminUtilityService.getEpsilonValue(
            +((discount / 100) * this.originalAmount)
          );
        }

      if (type === 'FLAT' && discount >= this.originalAmount) {
        return 'isNumError';
      }

      if (type === 'PERCENTAGE' && discount >= 100) {
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
      discountType: this.discountForm.get('discountType').value,
      discountValue: this.discountForm.get('discountValue').value,
      totalDiscount: this.totalDiscount,
    });
  }

  handleCancel() {
    this.onClose.emit();
  }

  handleRemove() {
    this.onClose.emit({
      discountType: this.discountForm.get('discountType').value,
      discountValue: this.discountForm.get('discountValue').value,
      totalDiscount: 0,
    });
  }

  close() {
    this.onClose.emit();
  }
}
