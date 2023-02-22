export type FlagType =
  | 'default'
  | 'new'
  | 'initiated'
  | 'pending'
  | 'completed'
  | 'failed'
  | 'warning';

export type Chip<T extends string> = {
  label: string;
  value: T;
  total: number;
  isSelected: boolean;
  type: FlagType;
};

export type Cols = {
  field: string;
  header: string;
  isSort?: boolean;
  sortType?: string;
  dynamicWidth?: boolean;
  width?: string;
  isSearchDisabled?: boolean;
};

export type Filter<T extends string, K extends string> = {
  label: string;
  value: T;
  disabled: boolean;
  content: string;
  total: number;
  chips: Chip<K>[];
};

export type Status = {
  label: string;
  value: string;
  type: FlagType;
};
