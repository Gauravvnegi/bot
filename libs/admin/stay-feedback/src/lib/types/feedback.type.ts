export type ChartTypeOption = {
  name: string;
  value: string;
  url: string;
  backgroundColor: string;
};

export type SelectedEntityState = {
  entityState: string;
};

export type EntityState = {
  ACTIONED: number;
  HIGHPOTENTIAL: number;
  HIGHRISK: number;
  READ: number;
  UNREAD: number;
};
