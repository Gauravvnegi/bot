import { AgentTableResponse } from 'libs/admin/agent/src/lib/types/response';

type discard =
  | 'id'
  | 'nationality'
  | 'priceModifier'
  | 'priceModifierValue'
  | 'iataNumber'
  | 'isVerified'
  | 'status'
  | 'address'
  | 'code'
  | 'company';
export type GuestType = Omit<AgentTableResponse, discard>;
