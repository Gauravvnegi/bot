export type CookiesData = {
  accessToken: string;
  accessRefreshToken: string;
  user: string;
  'x-userId': string;
  hotelId: string;
};

export type UserData = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  cc: string;
  phoneNumber: string;
  profileUrl: string;
  permissions: {
    entity: string;
    label: string;
    permissions: {
      manage: number;
      view: number;
    };
    productType: string;
  }[];
  parentId: string;
  status: boolean;
  departments: {
    id: string;
    view: number;
    manage: number;
    module: string;
    department: string;
    entityId: string;
    userId: string;
    created: number;
    updated: number;
    productType: string;
    departmentLabel: string;
    productLabel: string;
  }[];

  agent: boolean;
  hotelAccess: {
    chains: {
      id: string;
      name: string;
      hotels: {
        id: string;
        name: string;
        imageUrl: string;
        logo: string;
        footerLogo: string;
        bgColor: string;
        nationality: string;
        timezone: string;
        outlets: any[];
        txnFbId: string;
        domain: string;
      }[];
    }[];
  };
};
