export type Amenity = {
  id: string;
  name: string;
  description: string;
  rate: number;
  startDate: number;
  endDate: number;
  active: boolean;
  currency: string;
  packageCode: string;
  imageUrl: { isFeatured: boolean; url: string }[];
  source: string;
  entityId: string;
  type: string;
  unit: string;
  category: string;
  autoAccept: boolean;
  hasChild: boolean;
  parentId: string;
};
