export type AreaForm = {
  id: string;
  name: string;
  shortDescription: string;
  attachedTables: string[];
  removedTables: string[];
};

export type AreaFormDataResponse = {
  created: number;
  description: string;
  id: string;
  name: string;
  status: true;
  updated: number;
  shortDescription: string;
  tables: {
    areaId: string;
    created: string;
    id: string;
    number: string;
    updated: number;
  }[];
};
