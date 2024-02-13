import { CategoryType } from "@hospitality-bot/admin/library";

export type MenuFormData = {
  name: string;
  imageUrl: string;
  description: string;
  status: boolean;
};

export type MenuResponse = MenuFormData & {
  id: string;
  entityId: string;
};

export type MenuItemCategory = {
  name: string;
  type: CategoryType;
  active: boolean;
  source: number;
};