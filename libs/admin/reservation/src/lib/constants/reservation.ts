import {
  JourneyState,
  JourneyType,
} from 'libs/admin/manage-reservation/src/lib/constants/reservation';
import { ReservationCurrentStatus } from 'libs/admin/manage-reservation/src/lib/models/reservations.model';
import { IGCellInfo } from 'libs/admin/shared/src/lib/components/interactive-grid/interactive-grid.component';

const actionBtnConfig = [
  {
    label: 'Activate & Generate PreCheckIn',
  },
];

export enum actionType {
  ACTIVATE_AND_GENERATE_JOURNEY = 'ACTIVATE_AND_GENERATE_JOURNEY',
  EDIT_BOOKING = 'EDIT_BOOKING',
  VERIFY_DOCS = 'VERIFY_DOCS',
}

export const actionConfig = {
  activateAndGeneratePreCheckIn: {
    label: 'Activate & Generate PreCheckIn',
    type: 'ACTIVATE_AND_GENERATE',
  },
};

export const reservationStatusColorCode: Record<
  ReservationCurrentStatus,
  string
> = {
  NEW: 'success',
  RESERVED: 'success',
  DUEIN: 'success',
  INHOUSE: 'active',
  CHECKEDOUT: 'inactive',
  DUEOUT: 'warning',
};

export const viewDetails = [
  { label: 'View Details', value: 'VEIW_DETAILS' },
  { label: 'Manage Invoice', value: 'MANAGE_INVOICE' },
];

export const checkinOptions = [
  { label: 'Checkin', value: 'CHECKIN' },
  ...viewDetails,
];

export const checkoutOptions = [
  { label: 'Checkout', value: 'CHECKOUT' },
  ...viewDetails,
];

export const reservationMenuOptions: Record<
  ReservationCurrentStatus & 'PRECHECKIN',
  IGCellInfo['options']
> = {
  NEW: checkinOptions,
  RESERVED: checkinOptions,
  DUEIN: checkinOptions,
  INHOUSE: [
    { label: 'Cancel Checkin', value: 'CANCEL_CHECKIN' },
    ...checkoutOptions,
  ],
  DUEOUT: checkoutOptions,
  CHECKEDOUT: [
    { label: 'Cancel Checkout', value: 'CANCEL_CHECKOUT' },
    ...viewDetails,
  ],
  PRECHECKIN: [
    { label: 'Activate Precheckin', value: 'PRECHECKIN' },
    ...viewDetails,
  ],
  OUT_OF_SERVICE: [{ label: 'Cancel', value: 'CANCEL_OUT_OF_SERVICE' }],
};
