import { IteratorField } from 'libs/admin/shared/src/lib/types/fields.type';
import { AddRoomTypes } from '../types/room';

export const iteratorFields: Record<AddRoomTypes, IteratorField[]> = {
  single: [
    {
      label: 'Room No.',
      name: 'roomNo',
      type: 'input',
      required: true,
    },
    {
      label: 'Floor',
      name: 'floorNo',
      type: 'input',
      required: true,
    },
  ],
  multiple: [
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
      label: 'Floor No.',
      name: 'floorNo',
      type: 'input',
      required: true,
    },
  ],
};
