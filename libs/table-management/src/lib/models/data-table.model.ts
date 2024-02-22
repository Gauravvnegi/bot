import { EntityState, Option } from '@hospitality-bot/admin/shared';
import {
  Area,
  AreaListResponse,
  AreaResponse,
  Table,
  TableListResponse,
  TableResponse,
} from '../types/table-datable.type';

export class TableList {
  records: TableData[];
  entityStateCounts: EntityState<string>;
  entityTypeCounts: EntityState<string>;
  totalRecord: number;

  deserialize(input: TableListResponse) {
    if (!input) {
      return this;
    }

    this.entityStateCounts = input.entityStateCounts;
    this.entityTypeCounts = input.entityTypeCounts;
    this.totalRecord = input?.total;
    this.records =
      input.tables &&
      input?.tables.map((data) => {
        return new TableData().deserialize(data);
      });

    return this;
  }
}

export class TableData {
  id: string;
  name: string;
  pax: number;
  remark: string;
  status: string;
  nextStates: string[];
  foStatus: string;

  deserialize(input: TableResponse) {
    this.id = input?.id;
    this.name = `${input?.number}-${input?.area?.name ?? ''}`.trim();
    this.pax = input?.pax;
    this.remark = input?.remark;
    this.foStatus = input?.frontOfficeState;
    return this;
  }
}

export class AreaList {
  records: AreaData[];
  entityStateCounts: EntityState<string>;
  entityTypeCounts: EntityState<string>;
  totalRecord: number;

  deserialize(input: AreaListResponse) {
    if (!input) {
      return this;
    }

    this.entityStateCounts = input.entityStateCounts;
    this.entityTypeCounts = input.entityTypeCounts;
    this.totalRecord = input?.total;

    this.records =
      input?.areas &&
      input.areas.map((item) => {
        return new AreaData().deserialize(item);
      });

    return this;
  }
}

export class AreaData {
  id: string;
  name: string;
  description: string;
  date: string;
  status: boolean;
  tables: string;
  tableList?: Option[];
  deserialize(input: AreaResponse) {
    this.id = input?.id;
    this.name = input?.name;
    this.description = input?.description;
    this.status = input?.status;
    this.date = input?.updated && getFormattedDate(input?.updated);
    this.tables = input.tables?.map((item) => item?.number).join(', ');
    this.tableList = input?.tables?.map((item) => ({
      label: item?.number,
      value: item?.id,
    }));
    return this;
  }
}

export function getFormattedDate(time: number) {
  if (!time) return;
  const currentDate = new Date(time);
  const monthAbbreviated = new Intl.DateTimeFormat('en-US', {
    month: 'short',
  }).format(currentDate);
  const date = currentDate.getDate();
  const year = currentDate.getFullYear();
  return `${monthAbbreviated} ${date}, ${year}`;
}
