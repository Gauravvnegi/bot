export type UserResponse = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  otpVerified: boolean;
  cc: string;
  phoneNumber: string;
  profileUrl: string;
  permissions: {
    entity: string;
    label: string;
    permissions: {
      manage: -1 | 0 | 1;
      view: -1 | 0 | 1;
    };
    productType: string;
  }[];

  parentId: string;
  status: boolean;
  departments: {
    parentId: string;
    id: string;
    view: -1 | 0 | 1;
    manage: -1 | 0 | 1;
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
        outlets: [];
        txnFbId: string;
        domain: string;
        pmsEnable: boolean;
      }[];
    }[];
  };
};

export type UserListResponse = {
  total: number;
  entityTypeCounts: {};
  records: UserResponse[];
};
