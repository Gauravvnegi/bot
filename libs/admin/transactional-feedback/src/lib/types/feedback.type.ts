export type EntityState = {
  ACTIONED: number;
  HIGHPOTENTIAL: number;
  HIGHRISK: number;
  READ: number;
  UNREAD: number;
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
};
