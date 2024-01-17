import { SingleRoom } from 'libs/admin/room/src/lib/models/room.model';

export type TableForm<T> = {
  areaId: string;
  tables: Array<T>;
};

export type TableFormDataResponse = {
  tables: {
    created: number;
    entityId: string;
    frontOfficeState: string;
    id: string;
    inventoryType: string;
    number: string;
    pax: number;
    remark: string;
    updated: string;
    area: {
      description: string;
      id: string;
      name: string;
      shortDescription: string;
      status: boolean;
    };
  }[];
};

export type SingleTableForm = {
  id?: string;
  number: string;
  pax: number;
  remark: string;
};

export type MultipleTableForm = {
  from: number;
  to: number;
  pax: number;
  remark: string;
};

export type SingleTablePayload = SingleTableForm & { areaId?: string };

export type MultipleTablePayload = MultipleTableForm & { areaId?: string };
