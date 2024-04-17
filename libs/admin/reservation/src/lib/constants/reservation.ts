import { SessionType } from 'libs/admin/manage-reservation/src/lib/constants/form';
import {
  ReservationCurrentStatus,
  RoomReservation,
} from 'libs/admin/manage-reservation/src/lib/models/reservations.model';
import { IGCellInfo } from 'libs/admin/shared/src/lib/components/interactive-grid/interactive-grid.component';

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
  DUEOUT: [
    { label: 'Cancel Checkin', value: 'CANCEL_CHECKIN' },
    ...checkoutOptions,
  ],
  CHECKEDOUT: [
    { label: 'Cancel Checkout', value: 'CANCEL_CHECKOUT' },
    ...viewDetails,
  ],
  PRECHECKIN: [
    { label: 'Activate Precheckin', value: 'PRECHECKIN' },
    ...viewDetails,
  ],
  OUT_OF_SERVICE: [{ label: 'Cancel', value: 'CANCEL_OUT_OF_SERVICE' }],
  OUT_OF_ORDER: [{ label: 'Cancel', value: 'CANCEL_OUT_OF_ORDER' }],
};

export function calculateJourneyTime(
  defaultEndTime: string
): { currentTime: number; defaultTime: number } {
  const currentDateTime = new Date();
  const currentHours = currentDateTime.getHours();
  const currentMinutes = currentDateTime.getMinutes();
  const currentSeconds = currentDateTime.getSeconds();

  const [journeyHours, journeyMinutes, journeySeconds] = defaultEndTime.split(
    ':'
  );

  const currentEpochTime =
    currentHours * 3600 + currentMinutes * 60 + currentSeconds;
  const defaultJourneyEpoch =
    parseInt(journeyHours) * 3600 +
    parseInt(journeyMinutes) * 60 +
    parseInt(journeySeconds);

  return { currentTime: currentEpochTime, defaultTime: defaultJourneyEpoch };
}

export function getBookingIndicators(data: RoomReservation): string[] {
  const indicators: string[] = [];

  if (data) {
    if (data?.groupCode) {
      indicators.push('assets/images/group-booking.svg');
    }
    // if (data.paymentStatus === 'pending') {
    //     indicators.push('assets/images/payment-pending.svg');
    // }
    // if (data.guestType === 'VIP') {
    //     indicators.push('assets/images/VIP.svg');
    // }
    // if (data.guestType === 'single lady') {
    //     indicators.push('assets/images/single-lady.svg');
    // }
    if (data.sessionType === SessionType.DAY_BOOKING) {
      indicators.push('assets/images/day-booking.svg');
    }
  }

  return indicators;
}

export function secondsToHHMM(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const hoursStr = hours.toString().padStart(2, '0');
  const minutesStr = minutes.toString().padStart(2, '0');

  return `${hoursStr}:${minutesStr} Hrs`;
}
