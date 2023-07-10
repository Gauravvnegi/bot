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

export const noRecordActionForComp = {
  actionName: 'Create and Continue',
  description:
    'No services found. Tap the +Create and Continue to Import Services.',
  imageSrc: 'assets/images/empty-table-service.png',
};

export const noRecordActionForMenu = {
  description:
    'No Menu found. Tap the +Create and Continue to create the Menu.',
  imageSrc: 'assets/images/empty-table-service.png',
  actionName: 'Create and Continue',
};

export const noRecordActionForCompWithId = {
  actionName: '+ Import Services',
  description:
    'No Services Found. Tap the + Import Service to Import Services.',
  imageSrc: 'assets/images/empty-table-service.png',
};
export const noRecordActionForMenuWithId = {
  actionName: '+ Add Menu',
  description: 'No Menu Found. Tap the + Add Menu to Create the Menu.',
  imageSrc: 'assets/images/empty-table-service.png',
};
