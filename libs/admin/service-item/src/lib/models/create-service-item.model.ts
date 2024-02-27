import { ServiceItemResponse } from '../types/service-item-datatable.type';

export class ServiceItemFormData {
  itemName: string;
  categoryId: string;
  sla: number;
  users: string[];
  remarks: string;
  active: boolean;

  deserialize(input: ServiceItemResponse) {
    this.itemName = input?.itemName;
    this.categoryId = input?.category.id;
    this.sla = input.sla * 60 * 1000;
    this.users = input?.requestItemUsers.map((item) => item.userId);
    this.remarks = input?.remarks;
    this.active = input?.active;

    return this;
  }
}
