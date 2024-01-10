import { Validators } from '@angular/forms';
import {
  TableManagementDatableConfig,
  TableManagementDatableTabs,
} from '../types/table-datable.type';

export enum TableValue {
  table = 'TABLE',
  area = 'AREA',
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
  [TableValue.table]: {
    cols: [
      {
        field: 'name',
        header: 'Table',
        sortType: 'string',
        searchField: ['type', 'roomNo'],
        width: '23%',
      },
      {
        field: 'pax',
        header: 'No of Persons',
        sortType: 'date',
        isSearchDisabled: true,
      },
      {
        field: 'remark',
        header: 'Remarks',
        sortType: 'string',
        isSearchDisabled: true,
      },
      {
        field: 'status',
        header: 'Action / Status',
        sortType: 'string',
        isSearchDisabled: true,
        width: '16%',
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
        },
        {
          label: 'No of Person',
          name: 'pax',
          type: 'input',
          required: true,
        },
        {
          label: 'Remarks',
          name: 'remark',
          type: 'input',
          required: true,
        },
      ],
      MULTIPLE: [
        {
          label: 'From',
          name: 'from',
          type: 'input',
          required: true,
        },
        {
          label: 'To',
          name: 'to',
          type: 'input',
          required: true,
        },
        {
          label: 'No of Person',
          name: 'pax',
          type: 'input',
          required: true,
        },
        {
          label: 'Remarks',
          name: 'remark',
          type: 'input',
          required: true,
        },
      ],
    },
  },
  [TableValue.area]: {
    cols: [
      {
        field: 'name',
        header: 'Name',
        sortType: 'string',
        width: '20%',
      },
      {
        field: 'table',
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
  },
};
