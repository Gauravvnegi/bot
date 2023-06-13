import {
  AgentListResponse,
  AgentResponse,
  CompanyListResponse,
} from '../types/response';
import { EntityStateCountsResponse } from '../types/response';
export class Agent {
  id: string;
  name: string;
  code: number;
  verified: boolean;
  company: string;
  iataNo: number;
  email: string;
  phoneNo: string;
  commission: string;
  status: boolean;

  deserialize(input: AgentResponse) {
    this.id = input.id ?? '';
    this.name = input.name ?? '';
    this.code = input.code ?? 0;
    this.verified = input.verified ?? false;
    this.company = input.company ?? '';
    this.iataNo = input.iataNo ?? 0;
    this.email = input.email ?? '';
    this.phoneNo = input.phoneNo ?? '';
    this.commission = input.commission ?? '';
    this.status = input.active ?? false;
    return this;
  }
}

export class AgentList {
  agents: Agent[];
  total: number;
  entityStateCounts: EntityStateCounts;
  deserialize(input: AgentListResponse) {
    this.agents =
      input.records?.map((item) => new Agent().deserialize(item)) ?? [];
    this.total = input.total;
    this.entityStateCounts = new EntityStateCounts().deserialize(
      input?.entityStateCounts,
      input?.total ?? 0
    );
    return this;
  }
}

export class CompanyList {
  deserialize(input: CompanyListResponse) {}
}

export class EntityStateCounts {
  ALL: number;
  INACTIVE: number;
  ACTIVE: number;
  deserialize(input: EntityStateCountsResponse, total) {
    this.ALL = input.Active + input.Inactive ?? 0;
    this.ACTIVE = input.Active;
    this.INACTIVE = input.Inactive;
    return this;
  }
}
