import { FormClass } from '@hospitality-bot/admin/shared';
import { AreaForm, AreaFormDataResponse } from '../types/edit-area.type';

export class AreaFormData implements FormClass<AreaForm, AreaFormDataResponse> {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  tables: string[];
  attachedTables: string[];
  removedTables: string[];
  status: boolean;
  deserialize(input: AreaFormDataResponse) {
    this.id = input?.id;
    this.name = input?.name;
    this.description = input?.description;
    this.shortDescription = input?.shortDescription;
    this.attachedTables = input?.tables.map((item) => item.id);
    this.tables = input?.tables.map((item) => item.number);
    this.status = input?.status;

    return this;
  }
}

export class AreaPayloadData implements FormClass<AreaForm, AreaForm> {
  id: string;
  name: string;
  removedTables: string[];
  attachedTables: string[];
  shortDescription: string;
  status: boolean;
  deserialize(value: AreaForm) {
    this.id = value.id;
    this.name = value.name;
    this.removedTables = value.removedTables;
    this.attachedTables = value.attachedTables.filter(
      (item) => !value.removedTables.includes(item)
    );
    this.shortDescription = value.shortDescription;
    this.status = value?.status;
    return this;
  }
}
