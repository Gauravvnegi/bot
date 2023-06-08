export enum DeleteAction {
  'DELETE_ITEM' = 'DELETE_ITEM',
}

export const errorMessages = {
  required: 'This is a required field.',
  isPriceLess: 'Price cannot be less than the discount value.',
  isDiscountMore: 'Discount value cannot be more than price.',
  moreThan100: 'Cannot be more than 100%.',
  maxOccupancy: 'Value cannot be more than max occupancy.',
  notAllowedChr: 'Decimal are not allowed.',
  min: 'Value can not be less than 0.',
  moreThanTotal: 'Cannot be more than total',
};
