export type MenuFormData = {
  name: string;
  imageUrl: string;
  description: string;
  status: boolean;
}

export type MenuResponse = MenuFormData & {
  id: string;
  entityId: string;
}
