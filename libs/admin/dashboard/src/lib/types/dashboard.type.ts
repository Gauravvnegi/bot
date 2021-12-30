export type ChartTypeOption = {
  name: string;
  value: string;
  url: string;
};

export type SelectedEntityState = {
  entityState: string;
};

export type EntityType = {
  ARRIVAL: number;
  DEPARTURE: number;
  INHOUSE: number;
};

export type EntityState = {
  CHECKINCOMPLETE: number;
  CHECKINFAILED: number;
  CHECKININITIATED: number;
  CHECKINPENDING: number;
  NEW: number;
  PRECHECKINCOMPLETE: number;
  PRECHECKINFAILED: number;
  PRECHECKININITIATED: number;
  PRECHECKINPENDING: number;
};

export type SelectOption = { label: string; value: string };
