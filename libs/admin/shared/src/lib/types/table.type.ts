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
  field: string | string[];
  matchMode: MatchModes;
};

export type Chip<T extends string> = {
  label: string;
  value: T;
  total?: number;
  isSelected?: boolean;
  type: FlagType;
};

export type TableSortType = number | string | Date;

/**
 * Table value column fields
 * @property [header] Text for the column heading
 * @property [field] Field name for both sorting and filtering
 * @property [isSortDisabled]
 * @property [sortField] Field name for the sort filter and is prioritize over "field property"
 * @property [sortType] to select which sort logic to follow
 * @property [dynamicWidth]
 * @property [width]
 * @property [isSearchDisabled]
 * @property [searchField] All Fields for the search filter and is prioritize over "field property"
 * @property [matchMode] Matching criteria for search
 * @property [placeholder] Search placeholder text
 *
 */
export type Cols = {
  field: string;
  header: string;

  isSortDisabled?: boolean;
  sortField?: string;
  sortType?: TableSortType;
  width?: string;

  searchField?: string[];
  isSearchDisabled?: boolean;
  matchMode?: MatchModes;
  placeholder?: string;
};

// ---- chips need to be separated form filters
export type Filter<T extends string, K extends string> = {
  label: string;
  value: T;
  disabled?: boolean;
  content?: string;
  total: number;
  chips?: Chip<K>[];
};

export type Status = {
  label: string;
  value: string | boolean;
  type: FlagType;
  disabled?: boolean;
};

export type NextStates = Status[]

export type EmptyViewType ={
  description: string;
  actionName?: string;
  imageSrc: string;
  link?: string;
}