import { ServiceItemResponse } from '../types/service-item-datatable.type';

export class ServiceItemFormData {
  itemName: string;
  categoryId: string;
  sla: number;
  users: string[];
  remarks: string;

  deserialize(input: ServiceItemResponse) {
    this.itemName = input?.itemName;
    this.categoryId = input?.category.id;
    this.sla = input.sla * 60 * 1000;
    this.users = input?.requestItemUsers.map((item) => item.userId);
    this.remarks = input?.remarks;

    return this;
  }
}
