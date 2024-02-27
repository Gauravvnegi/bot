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
    entityStateKey?: string;
  }
>;

export type TableFoStatus = 'VACANT' | 'OCCUPIED';

export type TableStatus =
  | 'CLEAN'
  | 'INSPECTED'
  | 'OUT_OF_SERVICE'
  | 'OUT_OF_ORDER'
  | 'DIRTY';

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
  area: {
    description: string;
    id: string;
    name: string;
    shortDescription: string;
    status: true;
  };
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
  shortDescription: string;
  tables: {
    areaId: string;
    created: number;
    id: string;
    number: string;
    updated: number;
  }[];
};

export type Area = {};
