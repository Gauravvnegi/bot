export type AgentListResponse = {
  records: AgentResponse[];
  total: number;
  entityStateCounts: EntityStateCountsResponse;
};

export type AgentResponse = {
  id: string;
  name: string;
  code: number;
  verified: boolean;
  company: string;
  iataNo: number;
  email: string;
  phoneNo: string;
  commission: string;
  active: boolean;
};

export type EntityStateCountsResponse = {
  All: number;
  Active: number;
  Inactive: number;
};
