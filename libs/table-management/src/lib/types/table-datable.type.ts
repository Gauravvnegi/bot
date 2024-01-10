import { Cols } from '@hospitality-bot/admin/shared';
import { IteratorField } from 'libs/admin/shared/src/lib/types/fields.type';

export type TableManagementDatableTabs = 'AREA' | 'TABLE';

export type TableFormSubmissionType = 'MULTIPLE' | 'SINGLE';

export type TableManagementDatableConfig = Record<
  TableManagementDatableTabs,
  {
    cols: Cols[];
    emptyTableMessage: {
      description: string;
      actionName: string;
      imageSrc: string;
    };
    iteratorFields?: Record<TableFormSubmissionType, IteratorField[]>;
  }
>;

export type ManageTablePages =
  | 'createTable'
  | 'editable'
  | 'createArea'
  | 'editArea'
  | 'createMultipleTable';

export type TableListResponse = {
  tables: TableResponse[];
  entityTypeCounts: {
    AREA: number;
    TABLE: number;
  };
  entityStateCounts: {
    OCCUPIED: number;
    INACTIVE: number;
  };
  total: number;
};

export type TableResponse = {
  created: number;
  entityId: string;
  frontOfficeState: string;
  id: string;
  inventoryType: string;
  number: string;
  pax: number;
  remark: string;
  updated: string;
  status: boolean;
};

export type Table = {};

export type AreaListResponse = {
  areas: AreaResponse[];
  entityTypeCounts: {
    AREA: number;
    TABLE: number;
  };
  entityStateCounts: {
    OCCUPIED: number;
    INACTIVE: number;
  };
  total: number;
};

export type AreaResponse = {
  created: number;
  description: string;
  id: string;
  name: string;
  status: true;
  updated: number;
  table: string[];
};

export type Area = {};
