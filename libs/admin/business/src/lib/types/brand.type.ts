
export type SocialPlatForms = {
    name: string;
    imageUrl: string;
    redirectUrl?: string;
}

export type BrandFormData = {
  brand: {
    name: string;
    description: string;
    socialPlatforms: SocialPlatForms[];
    status: boolean;
  };
  siteId: string;
};

export type BrandResponse = {
  code:string
  id: string;
  name: string;
  logo: string;
  description: string;
  address: {
    id: string;
    latitude: number;
    longitude: number;
    pincode: number;
  };
  socialPlatforms: {
    created: number;
    updated: number;
    id: string;
    name: string;
    imageUrl: string;
    redirectUrl: string;
  }[];
  status: boolean;
}