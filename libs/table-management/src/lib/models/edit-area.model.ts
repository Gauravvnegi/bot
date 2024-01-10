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
  deserialize(input: AreaFormDataResponse) {
    this.id = input?.id;
    this.name = input?.name;
    this.description = input?.description;
    this.shortDescription = input?.shortDescription;
    this.attachedTables = input?.tables.map((item) => item.id);
    this.tables = input?.tables.map((item) => item.number);

    return this;
  }
}

export class AreaPayloadData implements FormClass<AreaForm, AreaForm> {
  id: string;
  name: string;
  removedTables: string[];
  attachedTables: string[];
  shortDescription: string;
  deserialize(value: AreaForm) {
    this.id = value.id;
    this.name = value.name;
    this.removedTables = value.removedTables;
    this.attachedTables = value.attachedTables.filter(
      (item) => !value.removedTables.includes(item)
    );
    this.shortDescription = value.shortDescription;
    return this;
  }
}
