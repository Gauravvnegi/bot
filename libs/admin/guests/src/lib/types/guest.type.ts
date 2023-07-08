import { AgentTableResponse } from 'libs/admin/agent/src/lib/types/response';

export type ChartTypeOption = {
  name: string;
  value: string;
  url: string;
  backgroundColor: string;
};

export type SelectedEntityState = {
  entityState: string;
};

export type SearchGuestResponse = {
  id: string;
  nameTitle?: string;
  firstName: string;
  lastName: string;
  contactDetails: {
    cc?: string;
    contactNumber?: string;
    emailId?: string;
  };
  nationality?: string;
  age: number;
};

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
