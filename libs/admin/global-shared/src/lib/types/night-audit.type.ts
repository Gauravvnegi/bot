import { FormActionConfig } from 'libs/admin/shared/src/lib/components/form-component/form-action/form-action.component';
import { CheckoutPendingResponse } from '../components/night-audit/types/checkout-pending.type';
import { LoggedInUsersResponse } from '../components/night-audit/types/loggedin-users.type';
import { CheckInResponseType } from '../components/night-audit/types/checkin-pending.type';

export type ActionConfigType =
  | Pick<FormActionConfig, 'preLabel' | 'postLabel' | 'preSeverity'>
  | Record<string, string | boolean>;

export interface NightAuditResponse {
  LoggedInUsers: LoggedInUsersResponse[];
  CheckInPending: CheckInResponseType[];
  CheckOutPending: CheckoutPendingResponse[];
}
