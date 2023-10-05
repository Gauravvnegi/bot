import { FlagType } from '@hospitality-bot/admin/shared';
import { ReservationTab, ReservationType } from '../types/response.type';

export const reservationStatus: Record<
  ReservationType | ReservationTab,
  { label: string; type: FlagType }
> = {
  INHOUSE: {
    label: 'In-house',
    type: 'default',
  },
  ARRIVAL: {
    label: 'Arrival/Due-In',
    type: 'default',
  },
  DEPARTURE: {
    label: 'Departure/Due-out',
    type: 'default',
  },

  CHECKINPENDING: {
    label: 'CheckIn_Pending',
    type: 'draft',
  },
  CHECKININITIATED: {
    label: 'CheckIn_Initiated',
    type: 'active',
  },
  CHECKINCOMPLETE: {
    label: 'CheckIn_Complete',
    type: 'completed',
  },
  CHECKINFAILED: {
    label: 'CheckIn_Failed',
    type: 'failed',
  },
  PRECHECKINPENDING: {
    label: 'PrecheckIn_Pending',
    type: 'draft',
  },
  PRECHECKININITIATED: {
    label: 'PrecheckIn_Initiated',
    type: 'active',
  },
  PRECHECKINFAILED: {
    label: 'PrecheckIn_Failed',
    type: 'failed',
  },
  PRECHECKINCOMPLETE: {
    label: 'PrecheckIn_Complete',
    type: 'completed',
  },
  NEW: {
    label: 'New',
    type: 'active',
  },
  CHECKOUTCOMPLETED: {
    label: 'Check_Out_Completed',
    type: 'completed',
  },
  CHECKOUTFAILED: {
    label: 'Check_Out_Failed',
    type: 'failed',
  },
  CHECKOUTINITIATED: {
    label: 'Check_Out_Initiated',
    type: 'active',
  },
  CHECKOUTPENDING: {
    label: 'Check_Out_Pending',
    type: 'draft',
  },
};

export const campaignStatus: Record<
  'CHECKIN' | 'CHECKOUT' | 'NEW' | 'QUEUED',
  { label: string; type: FlagType }
> = {
  CHECKIN: {
    label: 'Checkin',
    type: 'completed',
  },
  CHECKOUT: {
    label: 'Checkout',
    type: 'inactive',
  },
  NEW: {
    label: 'New',
    type: 'success',
  },
  QUEUED: {
    label: 'Queued',
    type: 'success',
  },
};

export function getColorCode(jouryneyStatus: string) {
  if (jouryneyStatus) return campaignStatus[jouryneyStatus].type;
}
