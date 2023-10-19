import { FormActionConfig } from 'libs/admin/shared/src/lib/components/form-component/form-action/form-action.component';
import { CheckoutPendingResponse } from '../components/night-audit/types/checkout-pending.type';
import { CheckInResponseType } from '../components/night-audit/types/checkin-pending.type';

export type ActionConfigType =
  | Pick<
      FormActionConfig,
      'preLabel' | 'postLabel' | 'preSeverity' | 'preDisabled' | 'postDisabled'
    >
  | Record<string, string | boolean>;

export interface NightAuditResponse {
  CheckInPending: CheckInResponseType[];
  CheckOutPending: CheckoutPendingResponse[];
}
