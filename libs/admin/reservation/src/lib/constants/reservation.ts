import { JourneyState, JourneyType } from "libs/admin/manage-reservation/src/lib/constants/reservation";

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
  jouryneyStatus: Record<JourneyType, JourneyState>
) {
  if (jouryneyStatus) {
    if (jouryneyStatus.CHECKOUT === JourneyState.COMPLETED) return 'inactive';
    else if (jouryneyStatus.CHECKIN === JourneyState.COMPLETED) return 'active';
    else if (jouryneyStatus.PRECHECKIN === JourneyState.COMPLETED)
      return 'success';
    else if (jouryneyStatus.NEW === JourneyState.COMPLETED) return 'success';
    else return 'success';
  }
}
