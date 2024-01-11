import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminUtilityService, Option } from '@hospitality-bot/admin/shared';
import { errorMessages } from 'libs/admin/room/src/lib/constant/form';
import { MenuActionItem } from '../../constants/invoice.constant';
import { BillItemFields } from '../../types/forms.types';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

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

  serviceName: string;
  billItems: BillItemFields[];
  discountAction: MenuActionItem;

  totalDiscount: { [date: number]: number } = {};
  discountType: string;
  originalAmount: number;

  discountForm: FormGroup;
  discountOptions: Option[] = [
    { label: 'Flat', value: 'FLAT' },
    { label: '%Off', value: 'PERCENTAGE' },
  ];

  constructor(
    private fb: FormBuilder,
    private adminUtilityService: AdminUtilityService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig
  ) {
    const data = dialogConfig?.data as DiscountInput;
    const discountAction = data.discountAction;
    if (data) {
      this.serviceName = data.serviceName;
      this.billItems = data.billItems;
      if (discountAction) {
        this.isAdd = discountAction === MenuActionItem.ADD_DISCOUNT;
        this.isRemove = discountAction === MenuActionItem.REMOVE_DISCOUNT;
        this.isUpdate = discountAction === MenuActionItem.EDIT_DISCOUNT;
      }
    }
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.discountForm = this.fb.group({
      discountType: ['PERCENTAGE'],
      discountValue: [null, [Validators.min(0)]],
    });
    if (
      this.billItems.length === 1 ||
      !this.billItems.some(
        (item) => item.debitAmount !== this.billItems[0].debitAmount
      )
    )
      this.originalAmount = this.billItems[0].debitAmount;
    this.registerRateAndDiscountChange();
  }

  registerRateAndDiscountChange() {
    const leastAmount = this.billItems.reduce(
      (minAmount, item) => Math.min(minAmount, item.debitAmount),
      this.billItems[0]?.debitAmount || 0
    );

    this.billItems.forEach((item, index) => {
      const discountType = this.discountForm.get('discountType');
      const discountValue = this.discountForm.get('discountValue');

      const setDiscountValueAndErrors = () => {
        const discount = +(discountValue.value ?? 0);
        const type = discountType.value;
        if (item.debitAmount)
          if (type === 'FLAT') {
            this.totalDiscount[item.date] = discount;
          } else {
            this.totalDiscount[
              item.date
            ] = this.adminUtilityService.getEpsilonValue(
              +((discount / 100) * item.debitAmount)
            );
          }
        if (type === 'FLAT' && discount >= leastAmount) {
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
    });
  }

  checkForDistinctItems() {
    if (this.billItems.length === 1) return false;

    const isDistinct = this.billItems.some(
      (item) => item.debitAmount !== this.billItems[0].debitAmount
    );
    return isDistinct;
  }

  handleApply() {
    this.dialogRef.close({
      discountType: this.discountForm.get('discountType').value,
      discountValue: this.discountForm.get('discountValue').value,
      totalDiscount: this.totalDiscount,
    });
  }

  handleRemove() {
    const resetTotalDiscount: { [date: number]: number } = {};

    // Set each date to 0
    this.billItems.forEach((item) => {
      resetTotalDiscount[item.date] = 0;
    });

    this.dialogRef.close({
      discountType: this.discountForm.get('discountType').value,
      discountValue: this.discountForm.get('discountValue').value ?? 0,
      totalDiscount: resetTotalDiscount,
    });
  }

  close() {
    this.dialogRef.close();
  }
}

export type DiscountInput = {
  serviceName: string;
  billItems: BillItemFields[];
  discountAction: MenuActionItem;
};
