
export type IBrandFormData = {
  name: string;
  description: string;
  socialPlatforms: {
    facebook: string;
    twitter: string;
    instagram: string;
    youtube: string;
  };

  active: boolean;
};

export type BrnadType = {
  brand: {
    name: string;
    description: string;
    socialPlatforms: SocialPlatForms[];
  };
};

export type SocialPlatForms = {
    name: string;
    imageUrl: string;
    redirectUrl: string;
}

export type BrandFormData = {
  brand: {
    name: string;
    description: string;
    socialPlatforms: SocialPlatForms[];
    active: boolean;
  }
  siteId: string;
}

export type BrandResponse = {
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