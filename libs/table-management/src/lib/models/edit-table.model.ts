import { FormClass } from '@hospitality-bot/admin/shared';
import {
  MultipleTableForm,
  MultipleTablePayload,
  SingleTableForm,
  SingleTablePayload,
  TableForm,
  TableFormDataResponse,
} from '../types/edit-table.type';

export class TableFormData
  implements FormClass<TableForm<SingleTableForm>, TableFormDataResponse> {
  areaId: string;
  tables: SingleTableForm[];
  deserialize(input: TableFormDataResponse) {
    this.tables = input?.tables.map((item) => ({
      number: item?.number,
      pax: item?.pax,
      remark: item?.remark,
    }));
    this.areaId = input?.tables?.[0]?.area?.id;
    return this;
  }
}

export class SingleTableList {
  tables: SingleTablePayload[];

  deserialize(input: TableForm<SingleTableForm>) {
    this.tables = new Array<SingleTablePayload>();

    input?.tables.forEach((item) => {
      this.tables.push(new SingleTable().deserialize(item, input?.areaId));
    });
    return this;
  }
}
export class SingleTable {
  number: string;
  pax: number;
  remark: string;
  areaId?: string;
  id?: string;
  deserialize(input: SingleTableForm, areaId: string, id?: string) {
    this.number = input?.number;
    this.pax = input?.pax;
    this.areaId = areaId;
    this.remark = input?.remark;
    this.id = id;

    return this;
  }
}

export class MultipleTableList {
  tables: MultipleTableForm[];

  deserialize(input: TableForm<MultipleTableForm>) {
    this.tables = new Array<MultipleTablePayload>();

    input?.tables.forEach((item) => {
      this.tables.push(new MultipleTable().deserialize(item, input?.areaId));
    });
    return this;
  }
}

export class MultipleTable {
  from: number;
  to: number;
  pax: number;
  remark: string;
  areaId?: string;
  deserialize(input: MultipleTableForm, areaId: string) {
    this.from = input?.from;
    this.to = input?.to;
    this.pax = input?.pax;
    this.remark = input?.remark;
    this.areaId = areaId;
    return this;
  }
}
