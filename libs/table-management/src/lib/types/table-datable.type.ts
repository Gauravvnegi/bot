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
