import { FormClass } from '@hospitality-bot/admin/shared';
import { AreaForm, AreaFormDataResponse } from '../types/edit-area.type';

export class AreaFormData implements FormClass<AreaForm, AreaFormDataResponse> {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  deserialize(input: AreaFormDataResponse) {
    this.id = input?.id;
    this.name = input?.name;
    this.description = input?.description;
    this.shortDescription = input?.shortDescription;
    return this;
  }
}
