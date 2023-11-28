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

export function getColorCode(
  jouryneyStatus: Record<JourneyType, JourneyState>,
  status: string
) {
  if (jouryneyStatus) {
    if (jouryneyStatus.CHECKOUT === JourneyState.COMPLETED) return 'inactive';
    else if (jouryneyStatus.CHECKIN === JourneyState.COMPLETED) return 'active';
    else if (jouryneyStatus.PRECHECKIN === JourneyState.COMPLETED)
      return 'success';
    else if (jouryneyStatus.NEW === JourneyState.COMPLETED) return 'success';
    else if (status === 'DUEOUT') return 'warning';
    else return 'success';
  }
}

export const viewDetails = [{ label: 'View Details', value: 'VEIW_DETAILS' }];

export const checkinOptions = [
  { label: 'Checkin', value: 'CHECKIN' },
  ...viewDetails,
];

export const checkoutOptions = [
  { label: 'Checkout', value: 'CHECKOUT' },
  ...viewDetails,
];

export const reservationMenuOptions: Record<
  ReservationCurrentStatus & 'PRECHEKIN',
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
  PRECHEKIN: [
    { label: 'Activate Precheckin', value: 'PRECHECKIN' },
    ...viewDetails,
  ],
};
