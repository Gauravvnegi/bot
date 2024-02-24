import { Validators } from '@angular/forms';
import {
  TableFoStatus,
  TableManagementDatableConfig,
  TableManagementDatableTabs,
  TableStatus,
} from '../types/table-datable.type';
import { FlagType } from '@hospitality-bot/admin/shared';

export enum TableValue {
  Table = 'TABLE',
  Area = 'AREA',
}

export const tabFilterItems: {
  label: string;
  value: TableManagementDatableTabs;
}[] = [
  {
    label: 'Table',
    value: 'TABLE',
  },
  {
    label: 'Area',
    value: 'AREA',
  },
];

export const tableManagementConfig: TableManagementDatableConfig = {
  [TableValue.Table]: {
    cols: [
      {
        field: 'name',
        header: 'Table',
        sortType: 'string',
        width: '23%',
      },
      {
        field: 'pax',
        header: 'No of Persons',
        isSortDisabled: true,
      },
      {
        field: 'remark',
        header: 'Remarks',
        sortType: 'string',
        isSearchDisabled: true,
      },
      {
        field: 'foStatus',
        header: 'FO Status',
        sortType: 'string',
        isSearchDisabled: true,
      },
    ],
    emptyTableMessage: {
      description: `No table found. Tap the "+Add Table" to create & manage the tables.`,
      actionName: '+ Add Table',
      imageSrc: 'assets/images/empty-table-room-types.png',
    },
    iteratorFields: {
      SINGLE: [
        {
          label: 'Table No.',
          name: 'number',
          type: 'input',
          required: true,
          validators: [Validators.pattern(/^[a-zA-Z0-9]*$/)],
          errorMessages: {
            pattern: 'Invalid Room Number',
          },
          placeholder: 'Enter table number (e.g. 122)',
        },
        {
          label: 'No of Person',
          name: 'pax',
          type: 'input',
          required: true,
          dataType: 'number',
          placeholder: 'Enter number of persons (e.g. 1)',
        },
        {
          label: 'Remarks',
          name: 'remark',
          type: 'input',
          required: true,
          placeholder: 'Enter remarks (e.g. This is VIP Table)',
        },
      ],
      MULTIPLE: [
        {
          label: 'From',
          name: 'from',
          type: 'input',
          required: true,
          placeholder: 'Enter start table number (e.g. 1)',
        },
        {
          label: 'To',
          name: 'to',
          type: 'input',
          required: true,
          placeholder: 'Enter end table number (e.g. 10)',
        },
        {
          label: 'No of Person',
          name: 'pax',
          type: 'input',
          required: true,
          dataType: 'number',
          placeholder: 'Enter number of persons (e.g. 1)',
        },
        {
          label: 'Remarks',
          name: 'remark',
          type: 'input',
          required: true,
          placeholder: 'Enter remarks (e.g. This is VIP Table)',
        },
      ],
    },
    entityStateKey: 'inventoryStatus',
  },
  [TableValue.Area]: {
    cols: [
      {
        field: 'name',
        header: 'Name',
        sortType: 'string',
        width: '20%',
      },
      {
        field: 'tables',
        header: 'Table',
        sortType: 'number',
        width: '16%',
      },
      {
        field: 'date',
        header: 'Date',
        sortType: 'number',
        width: '17%',
      },
      {
        field: 'description',
        header: 'Description',
        sortType: 'array',
        width: '18%',
      },

      {
        field: 'status',
        header: 'Action/Status',
        sortType: 'number',
        width: '16%',
        isSearchDisabled: true,
      },
    ],
    emptyTableMessage: {
      description: `No area created. Tap the "+Create Area" to create & manage the tables under the area.`,
      actionName: '+ Create Area',
      imageSrc: 'assets/images/empty-table-room-types.png',
    },
    entityStateKey: 'inventoryTypeStatus',
  },
};

export const tableStatusDetails: Record<
  TableStatus | TableFoStatus,
  { label: string; type: FlagType }
> = {
  CLEAN: {
    label: 'Clean',
    type: 'active',
  },
  INSPECTED: {
    label: 'Inspected',
    type: 'completed',
  },
  OUT_OF_SERVICE: {
    label: 'Out of Service',
    type: 'inactive',
  },
  OUT_OF_ORDER: {
    label: 'Out of Order',
    type: 'failed',
  },
  VACANT: {
    label: 'Vacant',
    type: 'success',
  },
  OCCUPIED: {
    label: 'Occupied',
    type: 'inactive',
  },
  DIRTY: {
    label: 'Dirty',
    type: 'warning',
  },
};

export const title: Record<TableValue, string> = {
  [TableValue.Area]: 'Area',
  [TableValue.Table]: 'Table',
};
