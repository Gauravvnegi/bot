import { EntityState } from '@hospitality-bot/admin/shared';
import { AgentTableResponse } from 'libs/admin/agent/src/lib/types/response';
export type AddressFieldType = {
  formattedAddress: string;
  city: string;
  state: string;
  countryCode: string;
  postalCode: string;
};
export interface GuestMemberForm {
  firstName: string;
  lastName: string;
  email: string;
  cc: string;
  phoneNo: string;
  company?: string;
  gender: string;
  dateOfBirth: string;
  age: string;
  address: AddressFieldType;
}

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
  salutation?: string;
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
  | 'nationality'
  | 'priceModifier'
  | 'priceModifierValue'
  | 'iataNumber';
export type GuestType = Omit<AgentTableResponse, discard>;

export type GuestListResponse = {
  records: GuestType[];
  total: number;
  entityTypeCounts: EntityState<string>;
  entityStateCounts: EntityState<string>;
};
