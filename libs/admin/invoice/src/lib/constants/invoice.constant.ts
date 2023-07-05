import { Option } from '@hospitality-bot/admin/shared';

export enum MenuActionItem {
  'ADD_DISCOUNT' = 'ADD_DISCOUNT',
  'REMOVE_DISCOUNT' = 'REMOVE_DISCOUNT',
  'EDIT_DISCOUNT' = 'EDIT_DISCOUNT',
  'DELETE_ITEM' = 'DELETE_ITEM',
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
  { label: 'Add Discount', value: MenuActionItem.ADD_DISCOUNT },
];

export const editDiscountMenu: Option[] = [
  { label: 'Update Discount', value: MenuActionItem.EDIT_DISCOUNT },
  { label: 'Remove Discount', value: MenuActionItem.REMOVE_DISCOUNT },
];

export const defaultMenu = [
  { label: 'Delete Item', value: MenuActionItem.DELETE_ITEM },
];
