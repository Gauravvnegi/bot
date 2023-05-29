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

export type DepartmentValue = {
  positiveValue: number;
  negativeValue: number;
};

export type SelectedChip = {
  entityState: string;
};

export type UpdateStatusData = {
  read: boolean;
  feedbackId: string[];
};

export type UpdateNoteData = {
  notes: string;
  status: string;
};

export type Chip = {
  label: string;
  icon: string;
  value: string;
  total: number;
  isSelected: boolean;
  type: string;
};

export type StatCard = {
  label: string;
  score: string | number;
  additionalData: string | number;
  comparisonPercent: number;
  color?: string;
}