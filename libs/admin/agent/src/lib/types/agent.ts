export type QueryConfig = {
  params: string;
};

export enum commissionType {
  PERCENTAGE = 'PERCENTAGE',
  COMMISSION = 'COMMISSION',
}

export type MemberSortTypes = 'A-Z' | 'Z-A' | 'Latest' | 'Modified' | 'Oldest';
export type SortingOrder = { sort: string; order: 'ASC' | 'DESC' };
