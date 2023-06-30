import { Option } from '@hospitality-bot/admin/shared';

export enum DiscountActionItem {
  'ADD_DISCOUNT' = 'ADD_DISCOUNT',
  'REMOVE_DISCOUNT' = 'REMOVE_DISCOUNT',
  'EDIT_DISCOUNT' = 'EDIT_DISCOUNT',
}

export const paymentOptions: Option[] = [
  { label: 'Razor Pay', value: 'razorPay' },
  { label: 'Cash', value: 'cash' },
  { label: 'Stripe', value: 'stripe' },
  { label: 'Pay at desk', value: 'payAtDesk' },
  { label: 'Bank Deposit', value: 'bankDeposit' },
];

export const discountOptions: Option[] = [
  { label: '%Off', value: 'PERCENT' },
  { label: 'Flat', value: 'FLAT' },
];

export const addRefundMenu: Option[] = [
  { label: 'Add Refund', value: 'addRefund' },
];
export const editRefundMenu: Option[] = [
  { label: 'Edit Refund', value: 'editRefund' },
];

export const addDiscountMenu: Option[] = [
  { label: 'Add Discount', value: DiscountActionItem.ADD_DISCOUNT },
];
export const editDiscountMenu: Option[] = [
  { label: 'Update Discount', value: DiscountActionItem.EDIT_DISCOUNT },
  { label: 'Remove Discount', value: DiscountActionItem.REMOVE_DISCOUNT },
];
