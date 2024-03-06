import { EntityState } from '@hospitality-bot/admin/shared';
import {
  ServiceItemListResponse,
  ServiceItemResponse,
} from '../types/service-item-datatable.type';

export class ServiceItemList {
  entityStateCounts: EntityState<string>;
  entityTypeCounts: EntityState<string>;
  records: ServiceItem[];
  total: number;

  deserialize(value: ServiceItemListResponse) {
    this.entityStateCounts = value?.entityStateCounts;
    this.entityTypeCounts = value?.entityTypeCounts;
    this.total = value?.total;
    this.records = value?.records.map((item) => {
      return new ServiceItem().deserialize(item);
    });
    return this;
  }
}

export class ServiceItem {
  id: string;
  name: string;
  category: string;
  users: { name: string; color: string }[];
  sla: string;
  complaintDue: string;
  total: string;
  remarks: string;
  status: boolean;
  totalUsers: number;

  deserialize(value: ServiceItemResponse) {
    this.id = value?.id;
    this.name = value?.itemName;
    this.category = value?.category?.name;
    this.sla = this.formatDuration(value?.sla);
    this.remarks = value?.remarks;
    this.status = value?.active;
    this.complaintDue = value?.complaintRequestStats?.openJobs;
    this.total = value?.complaintRequestStats?.total;
    this.totalUsers = value?.requestItemUsers.length;

    this.users = value?.requestItemUsers.map((item) => {
      return {
        name: this.generateNickname(item?.firstName, item?.lastName),
        color: this.generateRandomColor(),
      };
    });

    return this;
  }

  generateRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';

    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
  }

  formatDuration(minutes: number): string {
    if (!minutes) return undefined;

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    const formattedHours = hours > 0 ? `${hours}h` : '';
    const formattedMinutes =
      remainingMinutes > 0 ? `${remainingMinutes}min` : '';

    return `${formattedHours} ${formattedMinutes}`;
  }

  generateNickname(firstName?: string, lastName?: string): string {
    // Ensure that the input strings are defined
    if (!firstName && !lastName) {
      return '';
    }
    const firstTwoLettersFirstName = firstName ? firstName.slice(0, 1) : '';
    const firstTwoLettersLastName = lastName ? lastName.slice(0, 1) : '';

    const nickname = `${firstTwoLettersFirstName}${firstTwoLettersLastName}`;

    return nickname.trim().toUpperCase();
  }
}
