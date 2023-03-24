export type FlagType =
  | 'default'
  | 'new'
  | 'initiated'
  | 'pending'
  | 'completed'
  | 'failed'
  | 'warning'
  | 'standard';

// more modes can be added (take reference form primeNg filter)
export type MatchModes = 'startsWith' | 'contains' | 'endsWith' | 'equals';

export type TableFieldSearch = {
  value: string;
  field: string;
  matchMode: MatchModes;
};

export type Chip<T extends string> = {
  label: string;
  value: T;
  total: number;
  isSelected: boolean;
  type: FlagType;
};

export type TableSortType = 'number' | 'string' | 'date';

export type Cols = {
  field: string;
  header: string;
  isSort?: boolean;
  // sortType?: TableSortType;
  sortType?: string;
  dynamicWidth?: boolean;
  width?: string;
  isSearchDisabled?: boolean;
  matchMode?: MatchModes;
  placeholder?: string;
};

export type Filter<T extends string, K extends string> = {
  label: string;
  value: T;
  disabled: boolean;
  content: string;
  total: number;
  chips?: Chip<K>[];
};

export type Status = {
  label: string;
  value: string | boolean;
  type: FlagType;
  disabled?: boolean;
};
