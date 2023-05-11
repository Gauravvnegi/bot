
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
    socialPlatforms: SocialPlaforms<SocialPlaformsType>;
  };
};

export type SocialPlaforms<T extends string> = {
    name: SocialPlaformsType;
    imageUrl: string;
    redirectUrl: string;
}

export type SocialPlaformsType = 'facebook' | 'twitter' | 'instagram' | 'youtube';
