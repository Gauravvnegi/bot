import { SocialPlaforms, SocialPlaformsType } from "../types/brand.type";

export class BrandResponse {
  brand: {
    name: string;
    description: string;
    socialPlatforms: SocialPlaforms<SocialPlaformsType>[];
    active: boolean;
  } = {
      name: '',
      description: '',  
      socialPlatforms: [],
      active: false
  }
  siteId: string;
  deserialize(input: any) { 
    this.brand.name = input.name;
    this.brand.description = input.description;
    this.brand.socialPlatforms = input.socialPlatforms;
    this.brand.active = input.active;
    this.siteId = input.siteId;
    return this;
    

  }
}